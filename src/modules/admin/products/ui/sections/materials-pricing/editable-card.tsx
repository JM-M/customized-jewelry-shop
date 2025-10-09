"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useTRPC } from "@/trpc/client";

import { useAdminProduct } from "../../../contexts/admin-product";
import {
  MaterialsPricingFormValues,
  materialsPricingSchema,
} from "../../../schemas";
import { MaterialsPricingFields } from "./fields";
import { MaterialsPricingView } from "./view";

interface MaterialWithPrice {
  materialId: string;
  price: string;
  stockQuantity: string;
  isDefault: boolean;
}

export const MaterialsPricingCard = () => {
  const { product, refetchProduct, setProductData } = useAdminProduct();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<
    MaterialWithPrice[]
  >(
    product.materials?.map((m) => ({
      materialId: m.material.id,
      price: m.price,
      stockQuantity: m.stockQuantity?.toString() || "0",
      isDefault: m.isDefault || false,
    })) || [],
  );

  const trpc = useTRPC();

  // Fetch all materials
  const { data: materials, isLoading: materialsLoading } = useQuery(
    trpc.admin.products.getAllMaterials.queryOptions(),
  );

  const form = useForm<MaterialsPricingFormValues>({
    resolver: zodResolver(materialsPricingSchema),
    defaultValues: {
      price: product.price,
    },
  });

  const { mutate: updatePricingMutation, isPending } = useMutation(
    trpc.admin.products.updateProduct.mutationOptions(),
  );

  const updatePricing = (
    values: Parameters<typeof updatePricingMutation>[0],
  ) => {
    // Optimistically update the product data
    const updatedMaterials = values.materials?.map((m) => {
      const material = materials?.find((mat) => mat.id === m.materialId);
      return {
        id: `temp-${m.materialId}`,
        productId: product.id,
        materialId: m.materialId,
        price: m.price,
        stockQuantity: parseInt(m.stockQuantity),
        isDefault: m.isDefault,
        createdAt: new Date(),
        updatedAt: new Date(),
        material: material || {
          id: m.materialId,
          name: "Unknown",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    });

    setProductData({
      price: values.price,
      materials: updatedMaterials,
    });
    setIsEditing(false);

    updatePricingMutation(values, {
      onSuccess: () => {
        toast.success("Pricing updated successfully!");
        refetchProduct();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update pricing");
        setIsEditing(true);
      },
    });
  };

  const onSubmit = (values: MaterialsPricingFormValues) => {
    updatePricing({
      productId: product.id,
      price: values.price,
      materials: selectedMaterials,
    });
  };

  const handleCancel = () => {
    form.reset();
    setSelectedMaterials(
      product.materials?.map((m) => ({
        materialId: m.material.id,
        price: m.price,
        stockQuantity: m.stockQuantity?.toString() || "0",
        isDefault: m.isDefault || false,
      })) || [],
    );
    setIsEditing(false);
  };

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials((prev) => {
      const existing = prev.find((m) => m.materialId === materialId);
      if (existing) {
        return prev.filter((m) => m.materialId !== materialId);
      } else {
        return [
          ...prev,
          {
            materialId,
            price: "",
            stockQuantity: "0",
            isDefault: prev.length === 0,
          },
        ];
      }
    });
  };

  const updateMaterialPrice = (materialId: string, price: string) => {
    setSelectedMaterials((prev) =>
      prev.map((m) => (m.materialId === materialId ? { ...m, price } : m)),
    );
  };

  const updateMaterialStock = (materialId: string, stockQuantity: string) => {
    setSelectedMaterials((prev) =>
      prev.map((m) =>
        m.materialId === materialId ? { ...m, stockQuantity } : m,
      ),
    );
  };

  const setDefaultMaterial = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.materialId === materialId,
      })),
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-medium">Materials & Pricing</CardTitle>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={materialsLoading}
          >
            <EditIcon />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <MaterialsPricingFields
                form={form}
                materials={materials || []}
                selectedMaterials={selectedMaterials}
                onToggleMaterial={toggleMaterial}
                onUpdateMaterialPrice={updateMaterialPrice}
                onUpdateMaterialStock={updateMaterialStock}
                onSetDefaultMaterial={setDefaultMaterial}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  <XIcon />
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <MaterialsPricingView
            price={product.price}
            materials={product.materials}
          />
        )}
      </CardContent>
    </Card>
  );
};

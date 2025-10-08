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

import {
  materialsPricingSchema,
  MaterialsPricingFormValues,
} from "../../../schemas";
import { MaterialsPricingFields } from "./fields";
import { MaterialsPricingView } from "./view";

interface MaterialWithPrice {
  materialId: string;
  price: string;
  stockQuantity: string;
  isDefault: boolean;
}

interface MaterialsPricingCardProps {
  product: {
    id: string;
    price: string;
    materials?: Array<{
      material: {
        id: string;
        displayName: string;
        hexColor: string;
      };
      price: string;
      stockQuantity: number | null;
      isDefault: boolean | null;
    }>;
  };
}

export const MaterialsPricingCard = ({
  product,
}: MaterialsPricingCardProps) => {
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

  const { mutate: updatePricing, isPending } = useMutation({
    mutationFn: async (values: MaterialsPricingFormValues) => {
      // TODO: Implement actual update mutation
      console.log("Updating pricing:", {
        productId: product.id,
        ...values,
        materials: selectedMaterials,
      });
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("Pricing updated successfully!");
      setIsEditing(false);
      // TODO: Invalidate product query
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update pricing");
    },
  });

  const onSubmit = (values: MaterialsPricingFormValues) => {
    updatePricing(values);
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
            <EditIcon className="mr-2 h-4 w-4" />
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
                  <XIcon className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-4 w-4" />
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

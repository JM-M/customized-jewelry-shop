"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { ShippingFormValues, shippingSchema } from "../../../schemas";
import { ShippingFields } from "./fields";
import { ShippingView } from "./view";

// Mock packaging options - replace with actual API call
const mockPackaging = [
  { value: "pkg_1", label: "Standard Box" },
  { value: "pkg_2", label: "Premium Box" },
  { value: "pkg_3", label: "Luxury Gift Box" },
];

export const ShippingCard = () => {
  const { product, refetchProduct, setProductData } = useAdminProduct();
  const [isEditing, setIsEditing] = useState(false);
  const trpc = useTRPC();

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      packagingId: product.packagingId || "",
    },
  });

  const { mutate: updateShippingMutation, isPending } = useMutation(
    trpc.admin.products.updateProduct.mutationOptions(),
  );

  const updateShipping = (
    values: Parameters<typeof updateShippingMutation>[0],
  ) => {
    // Optimistically update the product data
    setProductData({
      packagingId: values.packagingId,
    });
    setIsEditing(false);

    updateShippingMutation(values, {
      onSuccess: () => {
        toast.success("Shipping configuration updated successfully!");
        refetchProduct();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update shipping");
        setIsEditing(true);
      },
    });
  };

  const onSubmit = (values: ShippingFormValues) => {
    updateShipping({
      productId: product.id,
      packagingId: values.packagingId,
    });
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-medium">Shipping</CardTitle>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <EditIcon />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ShippingFields form={form} packagingOptions={mockPackaging} />
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
          <ShippingView packagingId={product.packagingId} />
        )}
      </CardContent>
    </Card>
  );
};

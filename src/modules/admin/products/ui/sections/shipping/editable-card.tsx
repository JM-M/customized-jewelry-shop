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

import { shippingSchema, ShippingFormValues } from "../../../schemas";
import { ShippingFields } from "./fields";
import { ShippingView } from "./view";

// Mock packaging options - replace with actual API call
const mockPackaging = [
  { value: "pkg_1", label: "Standard Box" },
  { value: "pkg_2", label: "Premium Box" },
  { value: "pkg_3", label: "Luxury Gift Box" },
];

interface ShippingCardProps {
  product: {
    id: string;
    packagingId: string | null;
  };
}

export const ShippingCard = ({ product }: ShippingCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      packagingId: product.packagingId || "",
    },
  });

  const { mutate: updateShipping, isPending } = useMutation({
    mutationFn: async (values: ShippingFormValues) => {
      // TODO: Implement actual update mutation
      console.log("Updating shipping:", { productId: product.id, ...values });
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("Shipping configuration updated successfully!");
      setIsEditing(false);
      // TODO: Invalidate product query
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update shipping");
    },
  });

  const onSubmit = (values: ShippingFormValues) => {
    updateShipping(values);
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
            <EditIcon className="mr-2 h-4 w-4" />
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
          <ShippingView packagingId={product.packagingId} />
        )}
      </CardContent>
    </Card>
  );
};

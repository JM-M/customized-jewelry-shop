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
import { SeoMetadataFormValues, seoMetadataSchema } from "../../../schemas";
import { SeoMetadataFields } from "./fields";
import { SeoMetadataView } from "./view";

export const SeoMetadataCard = () => {
  const { product, refetchProduct, setProductData } = useAdminProduct();
  const [isEditing, setIsEditing] = useState(false);
  const trpc = useTRPC();

  const form = useForm<SeoMetadataFormValues>({
    resolver: zodResolver(seoMetadataSchema),
    defaultValues: {
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
    },
  });

  const { mutate: updateSeoMutation, isPending } = useMutation(
    trpc.admin.products.updateProduct.mutationOptions(),
  );

  const updateSeo = (values: Parameters<typeof updateSeoMutation>[0]) => {
    // Optimistically update the product data
    setProductData({
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
    });
    setIsEditing(false);

    updateSeoMutation(values, {
      onSuccess: () => {
        toast.success("SEO metadata updated successfully!");
        refetchProduct();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update SEO metadata");
        setIsEditing(true);
      },
    });
  };

  const onSubmit = (values: SeoMetadataFormValues) => {
    updateSeo({
      productId: product.id,
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
    });
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-medium">SEO & Metadata</CardTitle>
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
              <SeoMetadataFields form={form} />
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
          <SeoMetadataView
            metaTitle={product.metaTitle}
            metaDescription={product.metaDescription}
          />
        )}
      </CardContent>
    </Card>
  );
};

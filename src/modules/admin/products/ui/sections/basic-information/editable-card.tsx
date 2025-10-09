"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useTRPC } from "@/trpc/client";

import { useAdminProduct } from "../../../contexts/admin-product";
import {
  BasicInformationFormValues,
  basicInformationSchema,
} from "../../../schemas";
import { BasicInformationFields } from "./fields";
import { BasicInformationView } from "./view";

export const BasicInformationCard = () => {
  const { product, refetchProduct, setProductData } = useAdminProduct();
  const [isEditing, setIsEditing] = useState(false);
  const trpc = useTRPC();

  // Fetch all categories
  const { data: allCategories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );

  // Transform categories to only show children with parent context, sorted by parent then child
  const categoryOptions = useMemo(() => {
    if (!allCategories) return [];

    // Filter to only child categories (those with parentId)
    const childCategories = allCategories.filter(
      (cat) => cat.parentId !== null,
    );

    // Sort by parent name, then child name
    const sortedChildren = childCategories.sort((a, b) => {
      const parentA = allCategories.find((p) => p.id === a.parentId);
      const parentB = allCategories.find((p) => p.id === b.parentId);

      const parentComparison = (parentA?.name || "").localeCompare(
        parentB?.name || "",
      );
      if (parentComparison !== 0) return parentComparison;

      return a.name.localeCompare(b.name);
    });

    // Map to combobox format with parent name included
    return sortedChildren.map((child) => {
      const parent = allCategories.find((p) => p.id === child.parentId);

      return {
        value: child.id,
        label: parent ? `${parent.name} > ${child.name}` : child.name,
      };
    });
  }, [allCategories]);

  const form = useForm<BasicInformationFormValues>({
    resolver: zodResolver(basicInformationSchema),
    defaultValues: {
      name: product.name,
      categoryId: product.categoryId || "",
      description: product.description || "",
    },
  });

  const { mutate: updateProductMutation, isPending } = useMutation(
    trpc.admin.products.updateProduct.mutationOptions(),
  );

  const updateProduct = (
    values: Parameters<typeof updateProductMutation>[0],
  ) => {
    // Optimistically update the product data
    setProductData({
      name: values.name,
      categoryId: values.categoryId,
      description: values.description,
    });
    setIsEditing(false);

    updateProductMutation(values, {
      onSuccess: () => {
        toast.success("Product information updated successfully!");
        refetchProduct();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update product");
        setIsEditing(true);
      },
    });
  };

  const onSubmit = (values: BasicInformationFormValues) => {
    updateProduct({
      productId: product.id,
      name: values.name,
      categoryId: values.categoryId,
      description: values.description,
    });
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-medium">Basic Information</CardTitle>
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
              <BasicInformationFields
                form={form}
                categories={categoryOptions}
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
          <BasicInformationView
            name={product.name}
            category={(product as any).category || undefined}
            description={product.description}
          />
        )}
      </CardContent>
    </Card>
  );
};

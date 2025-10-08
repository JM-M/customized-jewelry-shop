"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useTRPC } from "@/trpc/client";

import {
  BasicInformationFormValues,
  basicInformationSchema,
} from "../../../schemas";
import { BasicInformationFields } from "./fields";
import { BasicInformationView } from "./view";

interface BasicInformationCardProps {
  product: {
    id: string;
    name: string;
    categoryId: string | null;
    category?: {
      id: string;
      name: string;
    } | null;
    description: string | null;
    sku: string | null;
    stockQuantity: number | null;
  };
}

export const BasicInformationCard = ({
  product,
}: BasicInformationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const trpc = useTRPC();

  // Fetch all categories
  const { data: allCategories, isLoading: categoriesLoading } = useQuery(
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
      sku: product.sku || "",
      stockQuantity: product.stockQuantity?.toString() || "0",
    },
  });

  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: async (values: BasicInformationFormValues) => {
      // TODO: Implement actual update mutation
      console.log("Updating product:", { productId: product.id, ...values });
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("Product information updated successfully!");
      setIsEditing(false);
      // TODO: Invalidate product query
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  const onSubmit = (values: BasicInformationFormValues) => {
    updateProduct(values);
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={categoriesLoading}
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
          <BasicInformationView
            name={product.name}
            category={product.category || undefined}
            description={product.description}
            sku={product.sku}
            stockQuantity={product.stockQuantity}
          />
        )}
      </CardContent>
    </Card>
  );
};

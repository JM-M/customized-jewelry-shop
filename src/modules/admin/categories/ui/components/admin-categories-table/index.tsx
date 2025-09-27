import { DataTable } from "@/components/shared/data-table";
import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { GetAllCategoriesOutput } from "@/modules/categories/types";
import { CategoryFormDialog } from "../category-form-dialog";
import { createColumns } from "./columns";

type Category = GetAllCategoriesOutput[number];

export const AdminCategoriesTable = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useQuery(trpc.categories.getParentCategories.queryOptions());

  const deleteCategoryMutation = useMutation(
    trpc.admin.categories.deleteCategory.mutationOptions(),
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 text-red-600">
        Error loading categories data: {error.message}
      </div>
    );
  }

  const categories = categoriesData || [];

  const handleSuccess = () => {
    refetch();
    queryClient.invalidateQueries({
      queryKey: trpc.categories.getParentCategories.queryKey(),
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (
      confirm(
        `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      )
    ) {
      try {
        await deleteCategoryMutation.mutateAsync({ id: category.id });
        handleSuccess();
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const columns = createColumns(handleEdit, handleDelete);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon />
          Create Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Filter by name..."
        pageSize={10}
      />

      <CategoryFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleSuccess}
      />

      <CategoryFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialValues={
          editingCategory
            ? {
                ...editingCategory,
                description: editingCategory.description || undefined,
                parentId: editingCategory.parentId || undefined,
              }
            : undefined
        }
        onSuccess={() => {
          setIsEditDialogOpen(false);
          setEditingCategory(null);
          handleSuccess();
        }}
      />
    </div>
  );
};

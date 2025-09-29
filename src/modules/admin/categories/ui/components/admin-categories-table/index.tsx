import { DataTable } from "@/components/shared/data-table";
import { Spinner } from "@/components/shared/spinner";
import { Spinner2 } from "@/components/shared/spinner-2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

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

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategoryMutation.mutateAsync({ id: categoryToDelete.id });
      handleSuccess();
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete category. Please try again.");
      }
    }
  };

  const handleCancelDelete = () => {
    // Only allow canceling if mutation is not pending
    if (!deleteCategoryMutation.isPending) {
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const columns = createColumns(
    handleEdit,
    handleDelete,
    deleteCategoryMutation.isPending,
    categoryToDelete?.id,
  );

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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          // Only allow closing if mutation is not pending
          if (!deleteCategoryMutation.isPending) {
            setIsDeleteDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {'"'}
              {categoryToDelete?.name}
              {'"'}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleCancelDelete}
              disabled={deleteCategoryMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteCategoryMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategoryMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Deleting...
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

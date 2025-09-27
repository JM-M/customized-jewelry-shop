"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "./category-form";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    image: string;
    parentId?: string;
    isActive: boolean;
  }>;
  onSuccess?: () => void;
}

export const CategoryFormDialog = ({
  open,
  onOpenChange,
  initialValues,
  onSuccess,
}: CategoryFormDialogProps) => {
  const isEditing = !!initialValues?.id;

  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] !max-w-2xl overflow-y-auto px-3 sm:px-5">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the category information below."
              : "Fill in the details to create a new category."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <CategoryForm
            initialValues={initialValues}
            onSubmit={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

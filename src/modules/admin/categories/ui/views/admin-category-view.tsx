"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  CategoryFormDialog,
  CategoryOverviewCard,
  CategoryProductsSection,
  CategoryStatsDashboard,
  SubcategoriesSection,
} from "../components";

interface AdminCategoryViewProps {
  categorySlug: string;
}

export const AdminCategoryView = ({ categorySlug }: AdminCategoryViewProps) => {
  const trpc = useTRPC();
  const [isCreateSubcategoryDialogOpen, setIsCreateSubcategoryDialogOpen] =
    useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
    useState(false);

  const {
    data: categoryData,
    isLoading,
    error,
    refetch,
  } = useQuery(
    trpc.admin.categories.getCategoryWithSubcategories.queryOptions({
      categorySlug,
    }),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !categoryData) {
    return <div>Error loading category data</div>;
  }

  const { category, parentCategory, subcategories } = categoryData;

  const handleSuccess = () => {
    refetch();
  };

  const handleEditCategory = () => {
    setIsEditCategoryDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={category.name}
        description={`Manage category: ${category.name}`}
      />

      {/* Category Overview */}
      <CategoryOverviewCard
        category={category}
        parentCategory={parentCategory}
        onEdit={handleEditCategory}
      />

      {/* Stats Dashboard */}
      <CategoryStatsDashboard categoryId={category.id} />

      {/* Subcategories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Subcategories</h3>
            <p className="text-muted-foreground text-sm">
              {subcategories.length > 0
                ? `${subcategories.length} subcategor${subcategories.length === 1 ? "y" : "ies"} found`
                : "No subcategories found"}
            </p>
          </div>
          {!category.parentId && (
            <Button onClick={() => setIsCreateSubcategoryDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Subcategory
            </Button>
          )}
        </div>

        {subcategories.length > 0 && (
          <SubcategoriesSection
            subcategories={subcategories}
            categorySlug={categorySlug}
          />
        )}
      </div>

      {/* Products Section */}
      <CategoryProductsSection
        categorySlug={categorySlug}
        includeSubcategories={!category.parentId} // Only include subcategories if this is a parent category
      />

      {/* Create Subcategory Dialog */}
      <CategoryFormDialog
        open={isCreateSubcategoryDialogOpen}
        onOpenChange={setIsCreateSubcategoryDialogOpen}
        initialValues={{ parentId: category.id }}
        onSuccess={handleSuccess}
      />

      {/* Edit Category Dialog */}
      <CategoryFormDialog
        open={isEditCategoryDialogOpen}
        onOpenChange={setIsEditCategoryDialogOpen}
        initialValues={{
          ...category,
          description: category.description || undefined,
          parentId: category.parentId || undefined,
        }}
        onSuccess={() => {
          setIsEditCategoryDialogOpen(false);
          handleSuccess();
        }}
      />
    </div>
  );
};

"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
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

  const {
    data: categoryData,
    isLoading,
    error,
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
      />

      {/* Stats Dashboard */}
      <CategoryStatsDashboard categoryId={category.id} />

      {/* Subcategories Section */}
      {subcategories.length > 0 && (
        <SubcategoriesSection
          subcategories={subcategories}
          categorySlug={categorySlug}
        />
      )}

      {/* Products Section */}
      <CategoryProductsSection
        categorySlug={categorySlug}
        includeSubcategories={!category.parentId} // Only include subcategories if this is a parent category
      />
    </div>
  );
};

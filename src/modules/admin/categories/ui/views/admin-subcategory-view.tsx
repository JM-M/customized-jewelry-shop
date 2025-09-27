"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  CategoryOverviewCard,
  CategoryProductsSection,
  CategoryStatsDashboard,
} from "../components";

interface AdminSubcategoryViewProps {
  categorySlug: string;
  subcategorySlug: string;
}

export const AdminSubcategoryView = ({
  categorySlug,
  subcategorySlug,
}: AdminSubcategoryViewProps) => {
  const trpc = useTRPC();

  const {
    data: categoryData,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.categories.getCategoryWithSubcategories.queryOptions({
      categorySlug: subcategorySlug, // Use subcategorySlug since we're viewing a subcategory
    }),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !categoryData) {
    return <div>Error loading subcategory data</div>;
  }

  const { category, parentCategory } = categoryData;

  // Verify that this subcategory belongs to the specified parent category
  if (!parentCategory || parentCategory.slug !== categorySlug) {
    return <div>Subcategory not found in the specified parent category</div>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={category.name}
        description={`Manage subcategory: ${category.name} under ${parentCategory.name}`}
      />

      {/* Category Overview */}
      <CategoryOverviewCard
        category={category}
        parentCategory={parentCategory}
      />

      {/* Stats Dashboard */}
      <CategoryStatsDashboard categoryId={category.id} />

      {/* Products Section - Don't include subcategories for subcategories */}
      <CategoryProductsSection
        categorySlug={subcategorySlug}
        includeSubcategories={false} // Subcategories don't have their own subcategories
      />
    </div>
  );
};

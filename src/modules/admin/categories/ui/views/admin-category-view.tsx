"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { CategoryDetailsCard } from "../components/category-details-card";
import { CategoryImageCard } from "../components/category-image-card";
import { SubcategoriesCard } from "../components/subcategories-card";

interface AdminCategoryViewProps {
  categorySlug: string;
}

export const AdminCategoryView = ({ categorySlug }: AdminCategoryViewProps) => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );

  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const parentCategory = category.parentId
    ? categories.find((c) => c.id === category.parentId)
    : null;

  const subcategories = categories.filter((c) => c.parentId === category.id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={category.name}
        description={`Manage category: ${category.name}`}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryDetailsCard
          category={category}
          parentCategory={parentCategory}
        />
        <CategoryImageCard category={category} />
      </div>

      <SubcategoriesCard
        subcategories={subcategories}
        parentCategorySlug={category.slug}
      />
    </div>
  );
};

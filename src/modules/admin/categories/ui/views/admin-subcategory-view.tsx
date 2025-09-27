"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface AdminSubcategoryViewProps {
  categorySlug: string;
  subcategorySlug: string;
}

export const AdminSubcategoryView = ({
  categorySlug,
  subcategorySlug,
}: AdminSubcategoryViewProps) => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );

  const subcategory = categories.find((c) => c.slug === subcategorySlug);

  if (!subcategory) {
    notFound();
  }

  // Verify that this subcategory belongs to the specified parent category
  const parentCategory = categories.find((c) => c.slug === categorySlug);
  if (!parentCategory || subcategory.parentId !== parentCategory.id) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={subcategory.name}
        description={`Manage subcategory: ${subcategory.name} under ${parentCategory.name}`}
      />
    </div>
  );
};

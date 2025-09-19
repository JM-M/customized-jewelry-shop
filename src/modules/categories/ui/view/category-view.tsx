"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { CategoryBreadcrumb } from "../components/category-breadcrumb";
import { CategoryHeader } from "../components/category-header";
import { ProductGrid } from "../components/product-grid";
import { Subcategories } from "../components/subcategories";

export const CategoryView = () => {
  const { categorySlug } = useParams();

  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );
  const category = categories.find((c) => c.slug === categorySlug);
  const subcategories = categories.filter((c) => c.parentId === category?.id);

  return (
    <div className="space-y-3 p-3">
      <CategoryBreadcrumb />
      <CategoryHeader />
      <Subcategories subcategories={subcategories} />
      <ProductGrid />
    </div>
  );
};

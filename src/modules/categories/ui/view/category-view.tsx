"use client";

import { CategoryBreadcrumb } from "../components/category-breadcrumb";
import { CategoryHeader } from "../components/category-header";
import { ProductGrid } from "../components/product-grid";
import { Subcategories } from "../components/subcategories";

export const CategoryView = () => {
  return (
    <div className="space-y-3 p-3">
      <CategoryBreadcrumb />
      <CategoryHeader />
      <Subcategories />
      <ProductGrid />
    </div>
  );
};

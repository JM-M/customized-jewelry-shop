"use client";

import { Categories } from "../components/categories";
import { CategoriesBreadcrumb } from "../components/categories-breadcrumb";

export const CategoriesView = () => {
  return (
    <div className="space-y-3 p-3">
      {/* <h2 className="text-2xl font-semibold">Categories</h2> */}
      <CategoriesBreadcrumb />
      <Categories />
    </div>
  );
};

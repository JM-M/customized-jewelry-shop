import { CategoryHeader } from "../components/category-header";
import { ProductGrid } from "../components/product-grid";
import { Subcategories } from "../components/subcategories";

export const CategoryView = () => {
  return (
    <div className="space-y-3 p-3">
      <CategoryHeader />
      <Subcategories />
      <ProductGrid />
    </div>
  );
};

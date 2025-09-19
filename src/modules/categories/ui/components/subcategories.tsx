import { GetAllCategoriesOutput } from "../../types";
import { CategoryCarousel } from "./category-carousel";

interface SubcategoriesProps {
  subcategories: GetAllCategoriesOutput[number][];
}

export const Subcategories = ({ subcategories }: SubcategoriesProps) => {
  if (subcategories.length === 0) return null;

  return (
    <div>
      <CategoryCarousel categories={subcategories} />
    </div>
  );
};

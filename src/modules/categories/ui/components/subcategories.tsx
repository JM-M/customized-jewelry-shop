import { CategoryCarousel } from "./category-carousel";

const categories = [
  {
    id: "1",
    name: "Subcategory 1",
    slug: "subcategory-1",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Subcategory 2",
    slug: "subcategory-2",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "Subcategory 3",
    slug: "subcategory-3",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "4",
    name: "Subcategory 4",
    slug: "subcategory-4",
    image: "https://via.placeholder.com/150",
  },
];

export const Subcategories = () => {
  return (
    <div>
      <CategoryCarousel
        categories={categories}
        title="Subcategories"
        viewAllLink="/categories"
      />
    </div>
  );
};

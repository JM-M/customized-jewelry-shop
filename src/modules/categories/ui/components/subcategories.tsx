import { CategoryCarousel } from "./category-carousel";

const categories = [
  {
    id: "1",
    name: "Subcategory 1",
    slug: "subcategory-1",
    image: "/images/1.png",
  },
  {
    id: "2",
    name: "Subcategory 2",
    slug: "subcategory-2",
    image: "/images/2.png",
  },
  {
    id: "3",
    name: "Subcategory 3",
    slug: "subcategory-3",
    image: "/images/3.png",
  },
  {
    id: "4",
    name: "Subcategory 4",
    slug: "subcategory-4",
    image: "/images/4.png",
  },
];

export const Subcategories = () => {
  return (
    <div>
      <CategoryCarousel categories={categories} />
    </div>
  );
};

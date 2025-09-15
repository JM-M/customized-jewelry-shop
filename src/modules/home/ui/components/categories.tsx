import { CategoryCard } from "./category-card";

const categories = [
  {
    name: "Necklaces",
    image: "/images/1.png",
    href: "/categories/necklaces",
  },
  {
    name: "Bracelets & Watches",
    image: "/images/2.png",
    href: "/categories/bracelets-and-watches",
  },
  {
    name: "Earrings",
    image: "/images/3.png",
    href: "/categories/earrings",
  },
  {
    name: "Rings",
    image: "/images/4.png",
    href: "/categories/rings",
  },
];

export const Categories = () => {
  return (
    <section className="p-3">
      <div className="grid grid-cols-2 gap-x-2 gap-y-4">
        {categories.map((category) => (
          <CategoryCard key={category.name} {...category} />
        ))}
      </div>
    </section>
  );
};

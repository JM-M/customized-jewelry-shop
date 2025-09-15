import { CategoryCard } from "./category-card";

export const Categories = () => {
  return (
    <section className="p-3">
      <div className="grid grid-cols-2 gap-3">
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
      </div>
    </section>
  );
};

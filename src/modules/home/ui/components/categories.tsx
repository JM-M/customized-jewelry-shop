import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CategoryCard } from "./category-card";

export const Categories = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );

  const topCategories = categories.filter((c) => !c.parentId) || [];

  return (
    <section className="p-3">
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {topCategories.map((category) => (
          <CategoryCard
            key={category.name}
            href={`/categories/${category.slug}`}
            name={category.name}
            image={category.image}
          />
        ))}
      </div>
    </section>
  );
};

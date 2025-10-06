import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { groupBy } from "lodash-es";
import Link from "next/link";
import { CategoryCard } from "./category-card";
import { Subcategories } from "./subcategories";

export const Categories = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );

  // Group categories by parent - categories without parentId are parent categories
  const parentCategories = categories.filter((category) => !category.parentId);
  const subcategoriesMap = groupBy(
    categories.filter((category) => category.parentId),
    "parentId",
  );

  return (
    <div className="space-y-8">
      {parentCategories.map((parentCategory) => {
        const subcategories = subcategoriesMap[parentCategory.id] || [];

        return (
          <div key={parentCategory.id} className="space-y-4">
            {/* Parent Category */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                {parentCategory.name}
              </h2>
              <Link
                href={`/categories/${parentCategory.slug}`}
                className="block"
              >
                <CategoryCard {...parentCategory} />
              </Link>
            </div>
            {/* Subcategories */}
            <div>
              <h3 className="mb-2 text-lg font-medium">
                {parentCategory.name} subcategories
              </h3>
              {subcategories.length > 0 && (
                <Subcategories subcategories={subcategories} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

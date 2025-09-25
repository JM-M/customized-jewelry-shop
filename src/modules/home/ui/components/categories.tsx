import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "./category-card";

export const Categories = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );

  // Show only 4 of the top categories
  const topCategories = categories.filter((c) => !c.parentId).slice(0, 4) || [];

  return (
    <section className="space-y-5 p-3">
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
        {topCategories.map((category) => (
          <CategoryCard
            key={category.name}
            href={`/categories/${category.slug}`}
            name={category.name}
            image={category.image}
          />
        ))}
      </div>
      <div>
        <Button
          variant="secondary"
          className="ml-auto flex h-12 w-fit !px-6"
          asChild
        >
          <Link href="/categories">
            See All Categories <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </section>
  );
};

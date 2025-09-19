import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { CategoryCarousel } from "./category-carousel";

export const Subcategories = () => {
  const { categorySlug } = useParams();
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );
  const category = categories.find((c) => c.slug === categorySlug);
  const subcategories = categories.filter((c) => c.parentId === category?.id);

  if (subcategories.length === 0) return null;

  return (
    <div>
      <CategoryCarousel categories={subcategories} />
    </div>
  );
};

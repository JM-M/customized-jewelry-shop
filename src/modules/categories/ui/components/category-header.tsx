import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const CategoryHeader = () => {
  const { categorySlug } = useParams();
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );
  const category = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="space-y-2">
      <h2 className="font-serif text-2xl">{category?.name}</h2>
      <p className="text-sm">{category?.description}</p>
    </div>
  );
};

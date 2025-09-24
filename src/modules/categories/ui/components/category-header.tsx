import { ShopPageHeader } from "@/components/shared/shop-page-header";
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
    <ShopPageHeader
      title={category?.name ?? ""}
      description={category?.description}
    />
  );
};

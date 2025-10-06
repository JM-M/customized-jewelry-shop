"use client";

import { useTRPC } from "@/trpc/client";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ProductGrid } from "../../../products/ui/components/product-grid";
import { CategoryBreadcrumb } from "../components/category-breadcrumb";
import { CategoryHeader } from "../components/category-header";
import { Subcategories } from "../components/subcategories";

export const CategoryView = () => {
  const { categorySlug } = useParams();

  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );
  const category = categories.find((c) => c.slug === categorySlug);
  const subcategories = categories.filter((c) => c.parentId === category?.id);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSuspenseInfiniteQuery(
      trpc.products.getManyByCategorySlug.infiniteQueryOptions(
        {
          categorySlug: categorySlug as string,
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      ),
    );

  if (!data) {
    return <div>No data available</div>;
  }

  // Flatten the pages to get all products
  const products = data.pages.flatMap((page) => page.items);
  const totalCount = data.pages[0]?.totalCount ?? 0;

  return (
    <div className="space-y-3 p-3">
      <CategoryBreadcrumb />
      <CategoryHeader />
      <Subcategories subcategories={subcategories} />
      <ProductGrid
        title="Products"
        data={{ items: products, totalCount }}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};

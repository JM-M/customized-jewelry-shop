"use client";

import { useTRPC } from "@/trpc/client";
import {
  keepPreviousData,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  urlStateToProductFilters,
  useProductsFilters,
} from "../../../products/hooks/use-products-filters";
import { ProductGrid } from "../../../products/ui/components/product-grid";
import { CategoryBreadcrumb } from "../components/category-breadcrumb";
import { CategoryHeader } from "../components/category-header";
import { Subcategories } from "../components/subcategories";

export const CategoryView = () => {
  const { categorySlug } = useParams();
  const [productFilters] = useProductsFilters();

  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );
  const category = categories.find((c) => c.slug === categorySlug);
  const subcategories = categories.filter((c) => c.parentId === category?.id);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getManyByCategorySlug.infiniteQueryOptions(
        {
          categorySlug: categorySlug as string,
          filters: urlStateToProductFilters(productFilters),
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          placeholderData: keepPreviousData,
        },
      ),
    );

  const { data: filterOptions } = useSuspenseQuery(
    trpc.products.getFilterOptions.queryOptions({
      categorySlug: categorySlug as string,
    }),
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
        filterOptions={filterOptions}
      />
    </div>
  );
};

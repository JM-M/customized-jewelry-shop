import { CategoryView } from "@/modules/categories/ui/views/category-view";
import { urlStateToProductFilters } from "@/modules/products/hooks/use-products-filters";
import { loadProductsSearchParams } from "@/modules/products/params";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<SearchParams>;
}

const CategoryPage = async ({ params, searchParams }: Props) => {
  const { categorySlug } = await params;

  const productFiltersSearchParams =
    await loadProductsSearchParams(searchParams);

  prefetch(
    trpc.products.getManyByCategorySlug.infiniteQueryOptions({
      categorySlug,
      filters: urlStateToProductFilters(productFiltersSearchParams),
    }),
  );

  return (
    <HydrateClient>
      <Suspense fallback="Loading category...">
        <ErrorBoundary fallback="An error occurred">
          <CategoryView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};
export default CategoryPage;

import { db } from "@/db";
import { categories } from "@/db/schema/shop";
import { CategoryView } from "@/modules/categories/ui/views/category-view";
import { urlStateToProductFilters } from "@/modules/products/hooks/use-products-filters";
import { loadProductsSearchParams } from "@/modules/products/params";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;

  const [category] = await db
    .select({
      id: categories.id,
      name: categories.name,
      description: categories.description,
    })
    .from(categories)
    .where(eq(categories.slug, categorySlug));

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found",
    };
  }

  return {
    title: category.name,
    description:
      category.description ||
      `Browse our collection of ${category.name.toLowerCase()} jewelry and accessories`,
    openGraph: {
      title: category.name,
      description:
        category.description ||
        `Browse our collection of ${category.name.toLowerCase()} jewelry and accessories`,
    },
  };
}

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

  prefetch(
    trpc.products.getFilterOptions.queryOptions({
      categorySlug,
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

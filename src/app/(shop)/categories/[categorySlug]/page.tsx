import { CategoryView } from "@/modules/categories/ui/views/category-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) => {
  const { categorySlug } = await params;

  prefetch(
    trpc.products.getManyByCategorySlug.infiniteQueryOptions({
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

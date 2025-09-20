import { CategoriesView } from "@/modules/categories/ui/views/categories-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const CategoriesPage = () => {
  prefetch(trpc.categories.getAll.queryOptions());

  return (
    <HydrateClient>
      <Suspense fallback="Loading categories...">
        <ErrorBoundary fallback="An error occurred">
          <CategoriesView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};
export default CategoriesPage;

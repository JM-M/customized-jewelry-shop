import { CategoriesView } from "@/modules/categories/ui/view/categories-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const CategoriesPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback="Loading categories...">
        <ErrorBoundary fallback="An error occurred">
          <CategoriesView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
export default CategoriesPage;

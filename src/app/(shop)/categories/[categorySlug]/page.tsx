import { CategoryView } from "@/modules/categories/ui/view/category-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const CategoryPage = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback="Loading category...">
        <ErrorBoundary fallback="An error occurred">
          <CategoryView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};
export default CategoryPage;

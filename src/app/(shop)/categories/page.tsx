import { CategoriesView } from "@/modules/categories/ui/views/categories-view";
import { HydrateClient, caller, getQueryClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const CategoriesPage = async () => {
  const queryClient = getQueryClient();

  // Use server caller directly to avoid HTTP requests during SSR
  await queryClient.prefetchQuery({
    queryKey: [["categories", "getAll"], { type: "query" }],
    queryFn: () => caller.categories.getAll(),
  });

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

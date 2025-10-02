import { CategoriesView } from "@/modules/categories/ui/views/categories-view";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const CategoriesPage = async () => {
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

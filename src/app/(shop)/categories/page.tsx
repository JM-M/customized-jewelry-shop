import { CategoriesView } from "@/modules/categories/ui/views/categories-view";
import { HydrateClient } from "@/trpc/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse our jewelry categories and find the perfect piece for every occasion",
};

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

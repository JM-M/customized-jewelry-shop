// TODO: Rename to page.tsx

import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { NewArrivalsView } from "@/modules/products/ui/views/new-arrivals-view";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "Discover our latest collection of customized jewelry and accessories",
};

export default async function NewArrivals() {
  // prefetch(
  //   trpc.products.getNewArrivals.queryOptions({
  //     limit: DEFAULT_PAGE_SIZE,
  //   }),
  // );
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getNewArrivals.queryOptions({
      limit: DEFAULT_PAGE_SIZE,
    }),
  );

  return (
    <HydrateClient>
      <Suspense fallback="Loading...">
        <ErrorBoundary fallback="An error occurred">
          <NewArrivalsView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}

import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { NewArrivalsView } from "@/modules/products/ui/views/new-arrivals-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function NewArrivals() {
  prefetch(
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

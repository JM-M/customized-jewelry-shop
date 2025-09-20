import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  prefetch(trpc.categories.getAll.queryOptions());
  prefetch(
    trpc.products.getNewArrivals.queryOptions({ limit: DEFAULT_PAGE_SIZE }),
  );

  return (
    <HydrateClient>
      <Suspense fallback="Loading...">
        <ErrorBoundary fallback="An error occurred">
          <HomeView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}

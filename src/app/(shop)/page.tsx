import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, caller, getQueryClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  const queryClient = getQueryClient();

  // Use server caller directly to avoid HTTP requests during SSR
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [["categories", "getAll"], { type: "query" }],
      queryFn: () => caller.categories.getAll(),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: [
        ["products", "getNewArrivals"],
        { input: { limit: DEFAULT_PAGE_SIZE }, type: "infinite" },
      ],
      queryFn: () =>
        caller.products.getNewArrivals({ cursor: 0, limit: DEFAULT_PAGE_SIZE }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),
  ]);

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

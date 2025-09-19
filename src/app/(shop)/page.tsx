import { HomeView } from "@/modules/home/ui/views/home-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback="Loading...">
        <ErrorBoundary fallback="An error occurred">
          <HomeView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}

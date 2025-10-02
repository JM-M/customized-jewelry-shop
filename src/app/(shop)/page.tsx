import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { categories } from "@/db/schema/shop";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { isNull } from "drizzle-orm";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {
  const parentCategories = await db
    .select({
      slug: categories.slug,
    })
    .from(categories)
    .where(isNull(categories.parentId));

  // Prefetch new arrivals
  prefetch(
    trpc.products.getNewArrivals.queryOptions({ limit: DEFAULT_PAGE_SIZE }),
  );

  // Prefetch products for each parent category
  parentCategories.forEach((category) => {
    prefetch(
      trpc.products.getManyByCategorySlug.queryOptions({
        categorySlug: category.slug,
        limit: DEFAULT_PAGE_SIZE,
      }),
    );
  });

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

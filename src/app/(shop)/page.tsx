import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { categories } from "@/db/schema/shop";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { isNull } from "drizzle-orm";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: "Home",
  description: `Welcome to ${siteConfig.name} - Your destination for customized jewelry and accessories. Discover unique pieces that express your individuality.`,
};

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

"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CategoryCarousel } from "../../../categories/ui/components/category-carousel";
import { Hero } from "../components/hero";
import { HomeProducts } from "../components/home-products";

export const HomeView = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );
  const parentCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="space-y-5">
      <div>
        <Hero />
        <section className="space-y-4 p-3">
          <CategoryCarousel categories={parentCategories} />
          <div>
            <Button
              variant="secondary"
              className="mx-auto flex h-12 w-fit !px-6"
              asChild
            >
              <Link href="/categories">See All Categories</Link>
            </Button>
          </div>
        </section>
      </div>
      {/* <SocialProof /> */}
      <HomeProducts />
      {/* <SocialMedia /> */}
    </div>
  );
};

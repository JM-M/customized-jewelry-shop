import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTRPC } from "@/trpc/client";
import { CategoryCard } from "./category-card";

export const Categories = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );

  // Show only 4 of the top categories
  const parentCategories = categories.filter((c) => !c.parentId);

  return (
    <section className="space-y-5 p-3">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {parentCategories.map((category) => (
            <CarouselItem
              key={category.name}
              className="basis-1/2 min-[400px]:basis-1/3 sm:basis-1/4 md:basis-1/5"
            >
              <CategoryCard
                href={`/categories/${category.slug}`}
                name={category.name}
                image={category.image}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-background/80 left-1 -translate-y-[25px]" />
        <CarouselNext className="bg-background/80 right-1 -translate-y-[25px]" />
      </Carousel>
      <div>
        <Button
          variant="secondary"
          className="mx-auto flex h-12 w-fit !px-6"
          asChild
        >
          <Link href="/categories">
            See All Categories <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </section>
  );
};

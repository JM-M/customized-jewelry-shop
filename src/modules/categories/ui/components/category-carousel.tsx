import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { GetAllCategoriesOutput } from "../../types";
import { CategoryCard } from "./category-card";

interface CategoryCarouselProps {
  categories: GetAllCategoriesOutput[number][];
}

export const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
  return (
    <div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => (
            <CarouselItem key={category.id} className="basis-1/2 pl-2 md:pl-4">
              <Link href={`/categories/${category.slug}`} className="block p-1">
                <CategoryCard category={category} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

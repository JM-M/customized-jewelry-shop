import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GetAllCategoriesOutput } from "../../types";
import { CategoryCard } from "./category-card";

interface CategoryCarouselProps {
  categories: GetAllCategoriesOutput[number][];
}

export const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {categories.map((category) => (
          <CarouselItem
            key={category.name}
            className="basis-1/2 min-[400px]:basis-1/3 sm:basis-1/4 md:basis-1/5"
          >
            <CategoryCard key={category.id} {...category} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-background/80 left-1 -translate-y-[25px]" />
      <CarouselNext className="bg-background/80 right-1 -translate-y-[25px]" />
    </Carousel>
  );
};

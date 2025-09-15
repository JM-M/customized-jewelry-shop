import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Category } from "../../types";
import { CategoryCard } from "./category-card";

interface CategoryCarouselProps {
  categories: Category[];
  title: string;
  viewAllLink: string;
}

export const CategoryCarousel = ({
  categories,
  title,
  viewAllLink,
}: CategoryCarouselProps) => {
  return (
    <div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => (
            <CarouselItem key={category.id} className="basis-1/2 pl-2 md:pl-4">
              <div className="p-1">
                <CategoryCard category={category} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

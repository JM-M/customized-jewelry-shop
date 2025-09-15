import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Product } from "../../types/product";
import { ProductCard } from "./product-card";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  viewAllLink: string;
}

export const ProductCarousel = ({
  products,
  title,
  viewAllLink,
}: ProductCarouselProps) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="gap-3 font-serif text-2xl font-medium">{title}</h3>
        <Link href={viewAllLink} className="text-sm underline">
          View All
        </Link>
      </div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="basis-2/3 pl-2 md:pl-4">
              <div className="p-1">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

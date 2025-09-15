import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Link from "next/link";

export const ProductCarousel = () => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="gap-3 font-serif text-xl font-medium">Customer Faves</h3>
        <Link href="/products" className="text-sm underline">
          View All
        </Link>
      </div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <CarouselItem key={index} className="basis-4/5 pl-2 md:pl-4">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <div className="text-center">
                      <span className="text-4xl font-semibold">
                        P{index + 1}
                      </span>
                      <p className="text-muted-foreground mt-2 text-sm">
                        Product {index + 1}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

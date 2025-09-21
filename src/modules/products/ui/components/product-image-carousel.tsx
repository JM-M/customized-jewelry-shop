"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useProduct } from "../../contexts/product";

export const ProductImageCarousel = () => {
  const { product } = useProduct();
  const images = product.images;

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="space-y-4">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="relative aspect-[6/7] w-full">
              <Image
                src={image}
                alt={`Product ${image}`}
                fill
                className="rounded-lg object-cover"
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Indicator dots */}
      <div className="flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-1 rounded-full transition-all ${
              current === index ? "bg-foreground" : "bg-muted-foreground/50"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

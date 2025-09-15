"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

const productImages = [
  {
    id: 1,
    image: "/images/1.png",
  },
  {
    id: 2,
    image: "/images/2.png",
  },
  {
    id: 3,
    image: "/images/3.png",
  },
  {
    id: 4,
    image: "/images/4.png",
  },
  {
    id: 5,
    image: "/images/5.png",
  },
  {
    id: 6,
    image: "/images/6.png",
  },
  {
    id: 7,
    image: "/images/7.png",
  },
  {
    id: 8,
    image: "/images/8.png",
  },
  {
    id: 9,
    image: "/images/9.png",
  },
  {
    id: 10,
    image: "/images/10.png",
  },
];

export const ProductImageCarousel = () => {
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
          {productImages.map((product, index) => (
            <CarouselItem
              key={product.id}
              className="relative aspect-[6/7] w-full"
            >
              <Image
                src={product.image}
                alt={`Product ${product.id}`}
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
        {productImages.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
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

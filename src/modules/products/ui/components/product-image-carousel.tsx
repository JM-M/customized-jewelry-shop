"use client";

import { CarouselIndicators } from "@/components/shared/carousel-indicators";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useState } from "react";
import { useProduct } from "../../contexts/product";

export const ProductImageCarousel = () => {
  const { product } = useProduct();
  const images = product.images;

  const [api, setApi] = useState<CarouselApi | null>(null);

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
                className="object-cover"
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <CarouselIndicators api={api} count={images.length} />
    </div>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useEffect } from "react";

export const Hero = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!api || !isPlaying) return;

    let intervalId: NodeJS.Timeout;

    const startAutoPlay = () => {
      intervalId = setInterval(() => {
        if (api && isPlaying) {
          api.scrollNext();
        }
      }, 4000); // Change image every 4 seconds
    };

    // Start auto-play
    startAutoPlay();

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [api, isPlaying]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Generate array of image paths
  const images = Array.from({ length: 10 }, (_, i) => `/images/${i + 1}.png`);

  return (
    <header className="relative h-fit">
      <div className="absolute inset-0 z-[1] bg-black/20" />

      <Carousel
        setApi={setApi}
        className=""
        opts={{
          loop: true,
        }}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <CarouselContent className="h-full">
          {images.map((src, index) => (
            <CarouselItem key={index} className="relative aspect-[4/5] w-full">
              <Image
                src={src}
                alt={`Hero ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-4 left-4 z-[2] w-40 space-y-4 text-white">
        <h1 className="font-serif text-xl font-medium">
          Customized Jewelry that Speaks to You
        </h1>
        <Button
          variant="secondary"
          className="bg-background text-foreground h-12 rounded-full !px-5"
        >
          Shop Now <ArrowRightIcon />
        </Button>
      </div>

      {/* Slide indicators */}
      {/* <div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              current === index ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}

      {/* <div className="text-background relative z-[2] flex h-full flex-col items-center justify-center gap-10 px-10 text-center">
        <h1 className="font-serif text-4xl font-semibold">
          Customized Jewelry that Speaks to You
        </h1>
        <div className="flex flex-col gap-3">
          <Button className="flex h-12 w-full !px-6">
            SHOP NEW COLLECTION
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button
            variant="secondary"
            className="flex h-12 w-full bg-white !px-6 text-black"
          >
            DESIGN YOUR OWN
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div> */}
    </header>
  );
};

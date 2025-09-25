"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Fade from "embla-carousel-fade";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Slide {
  image: string;
  text: string;
}

interface MobileHeroProps {
  slides: Slide[];
}

export const MobileHero = ({ slides }: MobileHeroProps) => {
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

  return (
    <header className="relative h-fit">
      <div className="absolute inset-0 z-[1] bg-black/20" />

      <Carousel
        setApi={setApi}
        className="embla"
        opts={{
          loop: true,
          duration: 30,
        }}
        plugins={[Fade()]}
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        <CarouselContent className="embla__container h-full">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className="embla__slide relative aspect-[4/5] w-full"
            >
              <Image
                src={slide.image}
                alt={`Hero ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute right-4 bottom-4 z-[2] w-40 space-y-4 text-white">
        <div className="flex h-fit items-center">
          {/* Fixed height container to prevent layout shift */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={current}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom easing curve
                scale: { duration: 0.3 },
              }}
              className="text-right font-serif text-xl font-medium"
            >
              {slides[current]?.text.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05, // Stagger each word
                    ease: "easeOut",
                  }}
                  className="mr-1 inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </AnimatePresence>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8, // Appear after text animation
            duration: 0.4,
            ease: "easeOut",
          }}
        >
          <Button
            variant="secondary"
            className="bg-background text-foreground ml-auto flex h-12 rounded-full !px-5 transition-transform hover:scale-105"
          >
            Shop Now <ArrowRightIcon />
          </Button>
        </motion.div>
      </div>
    </header>
  );
};

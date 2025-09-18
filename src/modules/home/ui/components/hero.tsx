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

  // Array of slide objects with image and text
  const slides = [
    {
      image: "/images/1.png",
      text: "Customized Jewelry that Speaks to You",
    },
    {
      image: "/images/2.png",
      text: "Handcrafted Elegance for Every Occasion",
    },
    {
      image: "/images/3.png",
      text: "Timeless Designs, Personal Stories",
    },
    {
      image: "/images/4.png",
      text: "Your Style, Our Craftsmanship",
    },
    {
      image: "/images/5.png",
      text: "Unique Pieces for Unique People",
    },
    {
      image: "/images/6.png",
      text: "Luxury Redefined, Just for You",
    },
    {
      image: "/images/7.png",
      text: "Where Dreams Meet Diamonds",
    },
    {
      image: "/images/8.png",
      text: "Artisan Quality, Personal Touch",
    },
    {
      image: "/images/9.png",
      text: "Create Memories, Wear Stories",
    },
    {
      image: "/images/10.png",
      text: "Bespoke Beauty, Endless Possibilities",
    },
  ];

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

      <div className="absolute bottom-4 left-4 z-[2] w-40 space-y-4 text-white">
        <div className="flex h-fit items-center">
          {" "}
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
              className="font-serif text-xl font-medium"
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
            className="bg-background text-foreground h-12 rounded-full !px-5 transition-transform hover:scale-105"
          >
            Shop Now <ArrowRightIcon />
          </Button>
        </motion.div>
      </div>

      {/* Slide indicators */}
      {/* <div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
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

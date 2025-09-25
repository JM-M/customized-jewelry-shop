"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Slide {
  image: string;
  text: string;
}

interface DesktopHeroProps {
  slides: Slide[];
}

export const DesktopHero = ({ slides }: DesktopHeroProps) => {
  // Select three images for the desktop side-by-side layout
  const desktopImages = slides.slice(0, 3);
  const [current, setCurrent] = useState(0);

  // Auto-cycle through the three images for text animation only
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative h-fit">
      <div className="relative w-full">
        <div className="grid grid-cols-3 gap-0">
          <div className="absolute inset-0 z-[1] bg-black/20" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={desktopImages[index]?.image || "/images/hero/9.jpg"}
                alt={`Jewelry Collection ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 z-[2] w-68 space-y-4 text-white">
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
              className="font-serif text-2xl font-medium"
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
            className="bg-background text-foreground flex h-12 rounded-full !px-5 transition-transform hover:scale-105"
          >
            Shop Now <ArrowRightIcon />
          </Button>
        </motion.div>
      </div>
    </header>
  );
};

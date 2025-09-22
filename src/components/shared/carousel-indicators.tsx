"use client";

import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface CarouselIndicatorsProps {
  api: CarouselApi | null;
  count: number;
  className?: string;
}

export const CarouselIndicators = ({
  api,
  count,
  className = "",
}: CarouselIndicatorsProps) => {
  const [current, setCurrent] = useState(0);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (count <= 1) return null;

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
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
  );
};

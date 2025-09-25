"use client";

import { DesktopHero } from "./desktop-hero";
import { MobileHero } from "./mobile-hero";

export const Hero = () => {
  // Array of slide objects with image and text
  const slides = [
    {
      image: "/images/hero/9.jpg",
      text: "Monument of Expression.",
    },
    {
      image: "/images/hero/10.jpg",
      text: "Give a piece that says what words can't.",
    },
    {
      image: "/images/hero/5.jpg",
      text: "Memories, engraved in gold.",
    },
    {
      image: "/images/hero/2.jpg",
      text: "Wear what makes you, you.",
    },
    {
      image: "/images/10.png",
      text: "Carry them close—always.",
    },
    {
      image: "/images/hero/7.jpg",
      text: "Unique Pieces for Unique People",
    },
    {
      image: "/images/6.png",
      text: "Crafted with care, worn with pride.",
    },
    {
      image: "/images/hero/11.jpg",
      text: "A milestone you can wear.",
    },
    {
      image: "/images/hero/4.jpg",
      text: "When a gift becomes a memory.",
    },
  ];

  return (
    <>
      {/* Mobile/Tablet Carousel - Hidden on sm and larger */}
      <div className="block sm:hidden">
        <MobileHero slides={slides} />
      </div>

      {/* Desktop Side-by-Side Layout - Hidden on screens smaller than sm */}
      <div className="hidden sm:block">
        <DesktopHero slides={slides} />
      </div>
    </>
  );
};

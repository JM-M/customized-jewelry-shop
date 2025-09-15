import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";

export const SocialProof = () => {
  return (
    <section className="p-3">
      <div>
        <h2 className="mb-2 text-center font-serif text-xl">
          Trusted by <span className="text-2xl font-semibold">1000+</span> Happy
          Customers
        </h2>
      </div>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index} className="basis-4/5 pl-2">
              <div className="p-1">
                <Card className="overflow-hidden p-0">
                  <CardContent className="relative flex aspect-[3/4] items-center justify-center p-0">
                    {/* Background Image */}
                    <Image
                      src={`/images/${index + 1}.png`}
                      alt={`Social proof ${index + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* Overlay for better button visibility */}
                    <div className="bg-opacity-30 absolute inset-0 bg-black/10"></div>

                    {/* Play button */}
                    <button className="bg-opacity-90 hover:bg-opacity-100 relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white transition-all duration-200 hover:scale-110">
                      <FaPlay className="ml-1 text-xl text-gray-800" />
                    </button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

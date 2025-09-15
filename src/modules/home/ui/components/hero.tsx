import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";

export const Hero = () => {
  return (
    <header className="relative h-88">
      <Image
        src="https://picsum.photos/400/600"
        alt="Hero"
        fill
        className="absolute inset-0 z-0 object-cover"
      />
      <div className="text-background relative z-[1] flex h-full flex-col items-center justify-center gap-5 px-10 text-center">
        <h1 className="font-serif text-4xl font-bold">CUSTOMIZED JEWELRY</h1>
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
      </div>
    </header>
  );
};

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon } from "lucide-react";

export const Newsletter = () => {
  return (
    <section className="p-3">
      <div className="space-y-5 py-8 text-center">
        <p>
          Subscribe to our newsletter and get 10% off your first order, and
          inside information on our latest offers and new arrivals.
        </p>
        <div className="relative mx-10">
          <Input placeholder="Enter your email" className="pr-14" />
          <Button size="icon" className="absolute top-0 right-0 h-full">
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
};

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/modules/home/ui/components/product-card";
import { FilterIcon } from "lucide-react";

export const ProductGrid = () => {
  return (
    <div>
      <div className="flex items-center justify-end">
        <Button variant="ghost">
          <FilterIcon /> Filter
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCard
            key={index}
            product={{
              id: index,
              name: `Product ${index + 1}`,
              price: 100,
              image: "https://via.placeholder.com/150",
            }}
          />
        ))}
      </div>
      <div className="my-6 flex items-center">
        <Button className="mx-auto flex h-12 !px-6">Load More</Button>
      </div>
    </div>
  );
};

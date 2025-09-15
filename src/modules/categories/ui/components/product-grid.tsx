import { Button } from "@/components/ui/button";
import { ProductCard } from "@/modules/home/ui/components/product-card";
import { FilterIcon } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    image: "/images/1.png",
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    image: "/images/2.png",
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    image: "/images/3.png",
  },

  {
    id: 4,
    name: "Product 4",
    price: 400,
    image: "/images/4.png",
  },
  {
    id: 5,
    name: "Product 5",
    price: 500,
    image: "/images/5.png",
  },
  {
    id: 6,
    name: "Product 6",
    price: 600,
    image: "/images/6.png",
  },
];

export const ProductGrid = () => {
  return (
    <div>
      <div className="flex items-center justify-end py-2">
        <Button variant="ghost" className="font-normal">
          <FilterIcon strokeWidth={1.2} /> Filter
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="my-6 flex items-center">
        <Button className="mx-auto flex h-12 !px-6">Load More</Button>
      </div>
    </div>
  );
};

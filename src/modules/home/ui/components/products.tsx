import { Product } from "../../types/product";
import { ProductCarousel } from "./product-carousel";

// Sample product data
const customerFavesProducts: Product[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: index + 1,
    name: `Lovely Bracelet ${index + 1}`,
    price: 12000 + index * 2000, // Range: 12,000 to 22,000
    image: "/images/2.png",
  }),
);

const newArrivalsProducts: Product[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: index + 7,
    name: `Elegant Jewelry ${index + 1}`,
    price: 25000 + index * 3000, // Range: 25,000 to 40,000
    image: "/images/1.png",
  }),
);

export const Products = () => {
  return (
    <section className="space-y-5 p-3">
      <ProductCarousel
        products={customerFavesProducts}
        title="Customer Faves"
        viewAllLink="/products"
      />
      <ProductCarousel
        products={newArrivalsProducts}
        title="New Arrivals"
        viewAllLink="/products/new"
      />
    </section>
  );
};

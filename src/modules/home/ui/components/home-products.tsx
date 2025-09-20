import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { ProductCarousel } from "@/modules/products/ui/components/product-carousel";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

// // Sample product data for customer faves (will be replaced when reviews are implemented)
// const customerFavesProducts: any[] = Array.from({ length: 6 }, (_, index) => ({
//   id: index + 1,
//   name: `Lovely Bracelet ${index + 1}`,
//   price: 12000 + index * 2000, // Range: 12,000 to 22,000
//   image: "/images/2.png",
// }));

export const HomeProducts = () => {
  const trpc = useTRPC();
  const { data: newArrivalsResponse } = useSuspenseQuery(
    trpc.products.getNewArrivals.queryOptions({ limit: DEFAULT_PAGE_SIZE }),
  );

  return (
    <section className="space-y-5 p-3">
      {/* <ProductCarousel
        products={customerFavesProducts}
        title="Customer Faves"
        viewAllLink="/products"
      /> */}
      <ProductCarousel
        products={newArrivalsResponse?.items || []}
        title="New Arrivals"
        viewAllLink="/new-arrivals"
      />
    </section>
  );
};

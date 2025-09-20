import { InfiniteLoadingTrigger } from "@/components/shared/infinite-loading-trigger";
import { Button } from "@/components/ui/button";
import { GetProductsByCategorySlugOutput } from "@/modules/products/types";
import { ProductCard } from "@/modules/products/ui/components/product-card";
import { FilterIcon } from "lucide-react";

interface ProductGridProps {
  data: {
    items: GetProductsByCategorySlugOutput["items"];
    totalCount: number;
  };
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export const ProductGrid = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: ProductGridProps) => {
  const { items: products, totalCount } = data;
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
      <InfiniteLoadingTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={!!isFetchingNextPage}
        fetchNextPage={fetchNextPage ?? (() => {})}
      />
    </div>
  );
};

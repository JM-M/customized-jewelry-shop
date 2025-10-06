import { InfiniteLoadingTrigger } from "@/components/shared/infinite-loading-trigger";
import { GetProductsByCategorySlugOutput } from "@/modules/products/types";
import { ProductCard } from "@/modules/products/ui/components/product-card";
import { ProductFilterDrawer } from "./product-filter-drawer";

interface ProductGridProps {
  data: {
    items: GetProductsByCategorySlugOutput["items"];
    totalCount: number;
  };
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  title?: string;
}

export const ProductGrid = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  title,
}: ProductGridProps) => {
  const { items: products, totalCount } = data;
  return (
    <div>
      <div className="flex items-center justify-between py-2">
        {title && <h3 className="text-lg">{title}</h3>}
        <ProductFilterDrawer />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 min-[500px]:grid-cols-3 md:grid-cols-4">
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

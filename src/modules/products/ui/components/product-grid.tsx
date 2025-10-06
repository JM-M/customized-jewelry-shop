import { InfiniteLoadingTrigger } from "@/components/shared/infinite-loading-trigger";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  GetProductFilterOptionsOutput,
  GetProductsByCategorySlugOutput,
} from "@/modules/products/types";
import { ProductCard } from "@/modules/products/ui/components/product-card";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { ProductFilterDrawer } from "./product-filter-drawer";
import { ProductFilters } from "./product-filters";

interface ProductGridProps {
  data: {
    items: GetProductsByCategorySlugOutput["items"];
    totalCount: number;
  };
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  title?: string;
  filterOptions?: GetProductFilterOptionsOutput;
}

export const ProductGrid = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  title,
  filterOptions,
}: ProductGridProps) => {
  const { items: products, totalCount } = data;

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const isMobile = useIsMobile();

  return (
    <>
      {isMobile && (
        <ProductFilterDrawer
          open={isFilterDrawerOpen}
          onOpenChange={setIsFilterDrawerOpen}
          filterOptions={filterOptions}
        />
      )}
      <div>
        <div className="flex items-center justify-between py-2">
          {title && <h3 className="text-lg">{title}</h3>}
          <Button
            variant="ghost"
            className="flex items-center gap-2 font-normal"
            onClick={() => {
              if (isMobile) {
                setIsFilterDrawerOpen(true);
              }
            }}
          >
            <FilterIcon strokeWidth={1.2} className="h-4 w-4" />
            Filter
            <span className="bg-primary text-primary-foreground ml-1 rounded-full px-2 py-0.5 text-xs">
              2
            </span>
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="@container flex-1">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 @lg:grid-cols-3 @xl:grid-cols-4">
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
          <div className="hidden w-xs md:block">
            <div className="sticky top-16">
              <ProductFilters filterOptions={filterOptions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

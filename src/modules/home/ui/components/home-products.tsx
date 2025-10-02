import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { ProductCarousel } from "@/modules/products/ui/components/product-carousel";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const HomeProducts = () => {
  const trpc = useTRPC();

  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );
  const parentCategories = categories.filter((c) => !c.parentId);

  const { data: newArrivalsResponse } = useSuspenseQuery(
    trpc.products.getNewArrivals.queryOptions({ limit: DEFAULT_PAGE_SIZE }),
  );

  return (
    <section className="space-y-5 p-3">
      <ProductCarousel
        products={newArrivalsResponse?.items || []}
        title="New Arrivals"
        viewAllLink="/new-arrivals"
      />

      {parentCategories.map((category) => (
        <CategoryProducts
          key={category.id}
          categorySlug={category.slug}
          categoryName={category.name}
        />
      ))}
    </section>
  );
};

interface CategoryProductsProps {
  categorySlug: string;
  categoryName: string;
}

const CategoryProducts = ({
  categorySlug,
  categoryName,
}: CategoryProductsProps) => {
  const trpc = useTRPC();

  const { data: categoryProductsResponse } = useSuspenseQuery(
    trpc.products.getManyByCategorySlug.queryOptions({
      categorySlug,
      limit: DEFAULT_PAGE_SIZE,
    }),
  );

  // Only render if there are products
  if (!categoryProductsResponse?.items?.length) {
    return null;
  }

  return (
    <ProductCarousel
      products={categoryProductsResponse.items}
      title={categoryName}
      viewAllLink={`/categories/${categorySlug}`}
    />
  );
};

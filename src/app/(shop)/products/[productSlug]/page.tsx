import { db } from "@/db";
import { products } from "@/db/schema/shop";
import { ProductView } from "@/modules/products/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) => {
  const { productSlug } = await params;

  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, productSlug));
  const productId = product.id;

  prefetch(trpc.products.getBySlug.queryOptions({ slug: productSlug }));
  prefetch(trpc.products.getProductMaterials.queryOptions({ productId }));
  prefetch(
    trpc.products.getProductCustomizationOptions.queryOptions({
      productId,
    }),
  );

  return (
    <HydrateClient>
      <Suspense fallback="Loading...">
        <ErrorBoundary fallback="An error occurred">
          <ProductView />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
};
export default ProductPage;

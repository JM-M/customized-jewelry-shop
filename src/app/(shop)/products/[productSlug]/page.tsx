import { ProductView } from "@/modules/products/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ProductPage = async ({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}) => {
  const { productSlug } = await params;
  prefetch(trpc.products.getBySlug.queryOptions({ slug: productSlug }));

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

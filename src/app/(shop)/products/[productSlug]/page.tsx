import { db } from "@/db";
import { products } from "@/db/schema/shop";
import { ProductView } from "@/modules/products/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;

  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
    })
    .from(products)
    .where(eq(products.slug, productSlug));

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found",
    };
  }

  return {
    title: product.name,
    description:
      product.description ||
      `Customized ${product.name} - Starting at ₦${product.price.toLocaleString()}`,
    openGraph: {
      title: product.name,
      description:
        product.description ||
        `Customized ${product.name} - Starting at ₦${product.price.toLocaleString()}`,
    },
  };
}

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

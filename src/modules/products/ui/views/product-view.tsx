"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { BuyProduct } from "../components/buy-product";
import { ProductCustomization } from "../components/product-customization";
import { ProductImageCarousel } from "../components/product-image-carousel";
import { ProductInfo } from "../components/product-info";

export const ProductView = () => {
  const { productSlug } = useParams();

  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.products.getBySlug.queryOptions({ slug: productSlug as string }),
  );

  const { data: productMaterials } = useSuspenseQuery(
    trpc.products.getMaterialsByProductId.queryOptions({
      productId: product.id,
    }),
  );

  return (
    <div className="space-y-3">
      <ProductImageCarousel images={product.images} />
      <ProductInfo product={product} />
      <ProductCustomization productMaterials={productMaterials} />
      <BuyProduct />
    </div>
  );
};

"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { AdminProductDetails } from "../components/admin-product-details";

export const AdminProductDetailsView = () => {
  const { productSlug } = useParams();
  const trpc = useTRPC();

  const { data: product, isLoading: productLoading } = useQuery(
    trpc.products.getBySlug.queryOptions({ slug: productSlug as string }),
  );

  const { data: productMaterials, isLoading: materialsLoading } = useQuery({
    ...trpc.products.getProductMaterialsByProductId.queryOptions({
      productId: product?.id || "",
    }),
    enabled: !!product?.id,
  });

  const { data: productEngravingAreas, isLoading: engravingAreasLoading } =
    useQuery({
      ...trpc.products.getProductEngravingAreasByProductId.queryOptions({
        productId: product?.id || "",
      }),
      enabled: !!product?.id,
    });

  const isLoading = productLoading || materialsLoading || engravingAreasLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={product.name}
        description={`Manage and view details for ${product.name}`}
      />
      <AdminProductDetails
        product={product}
        productMaterials={productMaterials || []}
        productEngravingAreas={productEngravingAreas || []}
      />
    </div>
  );
};

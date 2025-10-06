import { AdminProductDetailsView } from "@/modules/admin/products/ui/views/admin-product-details-view";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ productSlug: string }>;
}): Promise<Metadata> {
  const { productSlug } = await params;

  return {
    title: `Product: ${productSlug}`,
    description: `Edit and manage product details for ${productSlug}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const ProductPage = () => {
  return <AdminProductDetailsView />;
};
export default ProductPage;

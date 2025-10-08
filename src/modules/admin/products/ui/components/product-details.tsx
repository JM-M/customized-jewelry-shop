"use client";

import { useAdminProduct } from "../../contexts/admin-product";
import { BasicInformationCard } from "../sections/basic-information";
import { CustomizationOptionsCard } from "../sections/customization-options";
import { MaterialsPricingCard } from "../sections/materials-pricing";
import { ProductImagesCard } from "../sections/product-images";
import { SeoMetadataCard } from "../sections/seo-metadata";
import { ShippingCard } from "../sections/shipping";

export const ProductDetails = () => {
  const { product } = useAdminProduct();

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-4">
      <BasicInformationCard product={product} />
      <MaterialsPricingCard product={product} />
      <ProductImagesCard product={product} />
      <CustomizationOptionsCard product={product} />
      <ShippingCard product={product} />
      <SeoMetadataCard product={product} />
    </div>
  );
};

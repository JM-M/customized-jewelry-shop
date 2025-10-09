"use client";

import { BasicInformationCard } from "../sections/basic-information";
import { CustomizationOptionsCard } from "../sections/customization-options";
import { MaterialsPricingCard } from "../sections/materials-pricing";
import { ProductImagesCard } from "../sections/product-images";
import { SeoMetadataCard } from "../sections/seo-metadata";
import { ShippingCard } from "../sections/shipping";

export const ProductDetails = () => {
  return (
    <div className="space-y-4">
      <BasicInformationCard />
      <MaterialsPricingCard />
      <ProductImagesCard />
      <CustomizationOptionsCard />
      <ShippingCard />
      <SeoMetadataCard />
    </div>
  );
};

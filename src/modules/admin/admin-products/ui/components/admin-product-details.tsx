"use client";

import {
  GetEngravingAreasByProductIdOutput,
  GetMaterialsByProductIdOutput,
  GetProductByIdOutput,
} from "@/modules/products/types";

import { AdminProductCustomization } from "./admin-product-customization";
import { AdminProductDescription } from "./admin-product-description";
import { AdminProductImages } from "./admin-product-images";
import { AdminProductInfo } from "./admin-product-info";
import { AdminProductPackaging } from "./admin-product-packaging";
import { AdminProductReviews } from "./admin-product-reviews";
import { AdminProductSEO } from "./admin-product-seo";
import { AdminProductTimestamps } from "./admin-product-timestamps";

interface ProductDetailsProps {
  product: GetProductByIdOutput;
  productMaterials?: GetMaterialsByProductIdOutput;
  productEngravingAreas?: GetEngravingAreasByProductIdOutput;
}

// TODO: This component is a work in progress, it needs to be improved.

export const AdminProductDetails = ({
  product,
  productMaterials = [],
  productEngravingAreas = [],
}: ProductDetailsProps) => {
  return (
    <div className="space-y-6">
      {/* Product Info */}
      <AdminProductInfo product={product} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <AdminProductImages product={product} />

        {/* Product Information */}
        <div className="space-y-6">
          {/* Description */}
          <AdminProductDescription product={product} />

          {/* SEO Information */}
          <AdminProductSEO product={product} />
        </div>
      </div>

      {/* Customization Section */}
      <AdminProductCustomization product={product} />

      {/* Packaging Section */}
      <AdminProductPackaging product={product} />

      {/* Reviews Section */}
      <AdminProductReviews product={product} />

      {/* Additional Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Timestamps */}
        <AdminProductTimestamps product={product} />
      </div>
    </div>
  );
};

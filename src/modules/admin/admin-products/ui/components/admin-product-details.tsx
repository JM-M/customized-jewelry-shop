"use client";

import { useAdminProduct } from "../../contexts/admin-product";

import { AdminProductCustomization } from "./admin-product-customization";
import { AdminProductDescription } from "./admin-product-description";
import { AdminProductImages } from "./admin-product-images";
import { AdminProductInfo } from "./admin-product-info";
import { AdminProductPackaging } from "./admin-product-packaging";
import { AdminProductReviews } from "./admin-product-reviews";
import { AdminProductSEO } from "./admin-product-seo";
import { AdminProductTimestamps } from "./admin-product-timestamps";

export const AdminProductDetails = () => {
  const { product } = useAdminProduct();

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminProductInfo />
        <AdminProductPackaging />
      </div>
      <AdminProductCustomization />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdminProductImages />
        <div className="space-y-4">
          <AdminProductDescription />
          <AdminProductSEO />
        </div>
      </div>
      <AdminProductReviews />
      <AdminProductTimestamps />
    </div>
  );
};

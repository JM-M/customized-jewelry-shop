"use client";

import { ProductProvider } from "../../contexts/product";
import { BuyProduct } from "../components/buy-product";
import { ProductBreadcrumb } from "../components/product-breadcrumb";
import { ProductCustomization } from "../components/product-customization";
import { ProductImageCarousel } from "../components/product-image-carousel";
import { ProductInfo } from "../components/product-info";

export const ProductView = () => {
  return (
    <ProductProvider>
      <div className="relative space-y-3 md:flex">
        <div className="md:sticky md:top-17 md:h-fit md:w-1/2">
          <ProductImageCarousel />
        </div>
        <div className="space-y-4 md:w-1/2">
          <ProductBreadcrumb />
          <ProductInfo />
          <ProductCustomization />
          <BuyProduct />
        </div>
      </div>
    </ProductProvider>
  );
};

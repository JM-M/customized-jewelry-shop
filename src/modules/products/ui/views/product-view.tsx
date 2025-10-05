"use client";

import { ProductProvider } from "../../contexts/product";
import { BuyProduct } from "../components/buy-product";
import { ProductBreadcrumb } from "../components/product-breadcrumb";
import { ProductCustomization } from "../components/product-customization";
import { ProductImageCarousel } from "../components/product-image-carousel";
import { ProductInfo } from "../components/product-info";
import { ProductMaterials } from "../components/product-materials";
import { ProductReviews } from "../components/product-reviews";

export const ProductView = () => {
  return (
    <ProductProvider>
      <div>
        <div className="relative space-y-3 md:flex">
          <div className="md:sticky md:top-17 md:h-fit md:w-1/2">
            <ProductImageCarousel />
          </div>
          <div className="flex flex-col gap-3 md:w-1/2">
            <ProductBreadcrumb />
            <ProductInfo />
            <ProductMaterials />
            <ProductCustomization />
            <BuyProduct />
          </div>
        </div>
        <div>
          <ProductReviews />
        </div>
      </div>
    </ProductProvider>
  );
};

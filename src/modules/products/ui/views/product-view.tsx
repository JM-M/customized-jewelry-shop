"use client";

import { ProductProvider } from "../../contexts/product";
import { BuyProduct } from "../components/buy-product";
import { ProductCustomization } from "../components/product-customization";
import { ProductImageCarousel } from "../components/product-image-carousel";
import { ProductInfo } from "../components/product-info";

export const ProductView = () => {
  return (
    <ProductProvider>
      <div className="space-y-3">
        <ProductImageCarousel />
        <ProductInfo />
        <ProductCustomization />
        <BuyProduct />
      </div>
    </ProductProvider>
  );
};

import { BuyButton } from "../components/buy-button";
import { ProductCustomization } from "../components/product-customization";
import { ProductImageCarousel } from "../components/product-image-carousel";
import { ProductInfo } from "../components/product-info";

export const ProductView = () => {
  return (
    <div className="space-y-3">
      <ProductImageCarousel />
      <ProductInfo />
      <ProductCustomization />
      <BuyButton />
    </div>
  );
};

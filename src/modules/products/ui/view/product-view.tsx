import { BuyButton } from "../components/buy-button";
import { ProductImageCarousel } from "../components/product-image-carousel";
import { ProductInfo } from "../components/product-info";
import { ProductMaterialSelect } from "../components/product-material-select";

export const ProductView = () => {
  return (
    <div className="space-y-3">
      <ProductImageCarousel />
      <ProductInfo />
      <ProductMaterialSelect />
      <BuyButton />
    </div>
  );
};

import { formatNaira } from "@/lib/utils";
import { useProduct } from "../../contexts/product";
import { ProductStars } from "./product-stars";

export const ProductInfo = () => {
  const { product } = useProduct();
  const { name, price } = product;

  return (
    <div className="space-y-2 p-3">
      <h3 className="font-serif text-2xl">{name}</h3>
      <div className="text-xl">{formatNaira(Number(price))}</div>
      <ProductStars />
    </div>
  );
};

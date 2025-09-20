import { formatNaira } from "@/lib/utils";
import { GetProductByIdOutput } from "../../types";
import { ProductReviews } from "./product-reviews";

interface ProductInfoProps {
  product: GetProductByIdOutput;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const { name, price } = product;

  return (
    <div className="space-y-2 p-3">
      <h3 className="font-serif text-2xl">{name}</h3>
      <div className="text-xl">{formatNaira(Number(price))}</div>
      <ProductReviews />
    </div>
  );
};

import { formatNaira } from "@/lib/utils";
import { ProductReviews } from "./product-reviews";

export const ProductInfo = () => {
  return (
    <div className="space-y-2 p-3">
      <h3 className="font-serif text-2xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </h3>
      <div className="text-xl">{formatNaira(20000)}</div>
      <ProductReviews />
    </div>
  );
};

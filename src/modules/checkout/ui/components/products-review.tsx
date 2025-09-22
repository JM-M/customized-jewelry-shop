import { formatNaira } from "@/lib/utils";
import { useCart } from "@/modules/cart/contexts";
import { ReviewCartItemCard } from "./review-cart-item-card";

export const ProductsReview = () => {
  const { cart, cartSummary } = useCart();
  const cartItems = cart?.items || [];

  return (
    <div className="space-y-5">
      {cartItems.map((item) => (
        <ReviewCartItemCard key={item.id} item={item} />
      ))}
      <div className="flex items-center justify-between text-lg">
        <span className="font-medium text-gray-900"> Subtotal</span>
        <span className="font-medium text-gray-900">
          {formatNaira(cartSummary?.subtotal || 0)}
        </span>
      </div>
    </div>
  );
};

import { useCart } from "@/modules/cart/contexts";
import { CartItemCard } from "@/modules/cart/ui/components/cart-item-card";

export const ProductsReview = () => {
  const { cart } = useCart();
  const cartItems = cart?.items || [];

  return (
    <div className="space-y-5">
      {cartItems.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          hideCounter
          hideCustomizations
        />
      ))}
    </div>
  );
};

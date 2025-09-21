import { Spinner2 } from "@/components/shared/spinner-2";
import { useCart } from "@/modules/cart/contexts";
import { CartItemCard } from "./cart-item-card";

export const CartItems = () => {
  const { cart, isLoading } = useCart();
  const cartItems = cart?.items || [];

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <Spinner2 />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {cartItems.map((item) => (
        <CartItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

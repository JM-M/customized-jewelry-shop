import { Spinner2 } from "@/components/shared/spinner-2";
import { useCart } from "@/modules/cart/contexts";
import { CartItemCard } from "./cart-item-card";
import { EmptyCartState } from "./empty-cart-state";

export const CartItems = () => {
  const { cart, isLoading, setIsOpen } = useCart();
  const cartItems = cart?.items || [];

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <Spinner2 />
      </div>
    );
  }

  if (!cartItems.length) {
    return <EmptyCartState onContinueShopping={() => setIsOpen(false)} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {cartItems.map((item) => (
        <CartItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { useCart } from "@/modules/cart/contexts";

export const CheckoutButton = () => {
  const { cartSummary } = useCart();
  const subtotal = cartSummary?.subtotal || 0;
  // TODO: Add delivery fee
  const deliveryFee = 1000;
  const total = subtotal + deliveryFee;

  return (
    <>
      <div className="flex items-center justify-between text-lg">
        <span className="font-medium text-gray-900">Total</span>
        <span className="font-medium text-gray-900">{formatNaira(total)}</span>
      </div>
      <Button className="flex h-12 w-full">Checkout</Button>
    </>
  );
};

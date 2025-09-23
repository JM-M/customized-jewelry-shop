import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { useCheckoutFees } from "../../hooks/use-checkout-fees";

export const CheckoutButton = () => {
  const {
    deliveryFee,
    total,
    subtotal,
    hasSubtotal,
    hasDeliveryFee,
    hasTotal,
  } = useCheckoutFees();

  return (
    <div className="space-y-2">
      {hasSubtotal && (
        <div className="flex items-center justify-between text-lg">
          <span className="font-medium text-gray-900">Subtotal</span>
          <span className="font-medium text-gray-900">
            {formatNaira(subtotal!)}
          </span>
        </div>
      )}
      {hasDeliveryFee && (
        <div className="flex items-center justify-between text-lg">
          <span className="font-medium text-gray-900">Delivery Fee</span>
          <span className="font-medium text-gray-900">
            {formatNaira(deliveryFee!)}
          </span>
        </div>
      )}
      {hasTotal && (
        <div className="flex items-center justify-between text-lg">
          <span className="font-medium text-gray-900">Total</span>
          <span className="font-medium text-gray-900">
            {formatNaira(total!)}
          </span>
        </div>
      )}
      <Button className="flex h-12 w-full">Checkout</Button>
    </div>
  );
};

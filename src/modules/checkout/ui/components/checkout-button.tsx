import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { PaystackButton } from "react-paystack";
import { useCheckout } from "../../contexts/checkout";
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

  const { selectedAddressId } = useCheckout();

  // Generate a unique reference for this transaction
  const generateReference = () => {
    return `jewelry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const canProcessPayment = hasTotal && !!total && !!selectedAddressId;

  return (
    <div className="space-y-4">
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
      <Button asChild>
        <PaystackButton
          publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""}
          email="customer@example.com" // You might want to get this from user context
          amount={total! * 100} // Convert to kobo
          reference={generateReference()}
          text="Proceed to Payment"
          onSuccess={(reference) => {
            console.log("Payment successful:", reference);
            // Handle successful payment here
          }}
          onClose={() => {
            console.log("Payment closed");
            // Handle payment closure here
          }}
          className="flex h-12 w-full"
          disabled={!canProcessPayment}
        />
      </Button>
    </div>
  );
};

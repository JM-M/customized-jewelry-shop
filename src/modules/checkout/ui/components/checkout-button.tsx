"use client";

import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { usePaystackPayment } from "react-paystack";

import { authClient } from "@/lib/auth-client";
import { useCart } from "@/modules/cart/contexts";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useCheckout } from "../../contexts/checkout";
import { useCheckoutFees } from "../../hooks/use-checkout-fees";

export const CheckoutButton = () => {
  const session = authClient.useSession();
  const userEmail = session.data?.user?.email;

  const {
    deliveryFee,
    total,
    subtotal,
    hasSubtotal,
    hasDeliveryFee,
    hasTotal,
  } = useCheckoutFees();

  const { selectedAddressId, selectedRateId } = useCheckout();
  const { cart } = useCart();
  const trpc = useTRPC();
  const router = useRouter();

  // Create order mutation
  const { mutate: createOrder, isPending: isCreatingOrder } = useMutation(
    trpc.orders.createOrder.mutationOptions(),
  );

  // Generate a unique reference for this transaction
  const generateReference = () => {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const canProcessPayment =
    userEmail && hasTotal && !!total && !!selectedAddressId;

  const reference = generateReference();

  // Paystack payment configuration
  const config = {
    reference,
    email: userEmail!,
    amount: total! * 100, // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  // Initialize payment with usePaystackPayment hook
  const initializePayment = usePaystackPayment(config);

  const createOrderAndPay = () => {
    // Create order from cart
    if (cart?.id && selectedAddressId) {
      createOrder(
        {
          cartId: cart.id,
          deliveryAddressId: selectedAddressId,
          paymentReference: reference,
          rateId: selectedRateId || undefined,
        },
        {
          onSuccess: (result) => {
            console.log("Order created successfully:", result);
            initializePayment({
              onSuccess: () => {
                router.push(
                  // TODO: Redirect to order confirmation page or show success message
                  `/checkout/success?orderNumber=${result.order.orderNumber}`,
                );
              },
            });
          },
          onError: (error) => {
            console.error("Failed to create order:", error);
            // TODO: Show error message to user
          },
        },
      );
    }
  };

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
      <Button
        className="flex h-12 w-full"
        disabled={!canProcessPayment || isCreatingOrder}
        onClick={createOrderAndPay}
      >
        {isCreatingOrder ? "Processing..." : "Proceed to Payment"}
      </Button>
    </div>
  );
};

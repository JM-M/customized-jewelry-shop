"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { AdminOrderDetails } from "@/modules/admin/orders/types";
import { useTRPC } from "@/trpc/client";

interface FastCheckoutCheckoutButtonProps {
  order: AdminOrderDetails;
}

export const FastCheckoutButton = ({
  order,
}: FastCheckoutCheckoutButtonProps) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const trpc = useTRPC();

  // Generate a unique reference for this transaction if none exists
  const generateReference = () => {
    // Generate a human-readable reference using 64 bits from UUID v4
    // 64 bits = 2^64 possible values (~1.8×10^19)
    // Collision probability: 50% chance after ~2.1 billion IDs
    // Format: ref_[12-char hex string]
    const uuid = uuidv4().replace(/-/g, "");
    return `ref_${uuid.substring(0, 12).toUpperCase()}`;
  };

  const customerEmail = order.customer?.email || "";

  const {
    mutate: updatePaymentReference,
    isPending: isUpdatingPaymentReference,
  } = useMutation(trpc.orders.updatePaymentReference.mutationOptions());

  const reference = order.paymentReference || generateReference();
  const initializePayment = usePaystackPayment({
    reference,
    email: customerEmail,
    amount: Math.round(Number(order.totalAmount) * 100), // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  });

  const handlePayment = () => {
    if (!customerEmail) {
      alert("Customer email is required for payment");
      return;
    }

    updatePaymentReference(
      {
        orderNumber: order.orderNumber,
        paymentReference: reference,
      },
      {
        onSuccess: () => {
          // Initialize payment with the updated reference
          setIsProcessing(true);
          initializePayment({
            onSuccess: () => {
              router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
            },
            onClose: () => {
              setIsProcessing(false);
            },
          });
        },
        onError: (error) => {
          console.error("Failed to update payment reference:", error);
          alert("Failed to update payment reference. Please try again.");
        },
      },
    );
  };

  const isLoading = isUpdatingPaymentReference || isProcessing;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-lg">
        <span className="font-medium text-gray-900">Subtotal</span>
        <span className="font-medium text-gray-900">
          {formatNaira(Number(order.subtotal))}
        </span>
      </div>
      <div className="flex items-center justify-between text-lg">
        <span className="font-medium text-gray-900">Delivery Fee</span>
        <span className="font-medium text-gray-900">
          {formatNaira(Number(order.deliveryFee))}
        </span>
      </div>
      <div className="flex items-center justify-between text-lg">
        <span className="font-medium text-gray-900">Total</span>
        <span className="font-medium text-gray-900">
          {formatNaira(Number(order.totalAmount))}
        </span>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isLoading || !customerEmail}
        className="flex h-12 w-full"
      >
        {isLoading ? "Processing Payment..." : "Proceed to Payment"}
      </Button>
    </div>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { AdminOrderDetails } from "@/modules/admin/orders/types";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePaystackPayment } from "react-paystack";

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
    return `ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total Amount</span>
          <span>{formatNaira(Number(order.totalAmount))}</span>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isProcessing || isUpdatingPaymentReference || !customerEmail}
        className="w-full rounded-full py-6 text-lg"
        size="lg"
      >
        {isUpdatingPaymentReference
          ? "Updating Payment Reference..."
          : isProcessing
            ? "Processing Payment..."
            : "Complete Payment"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Secure payment powered by Paystack
      </p>
    </div>
  );
};

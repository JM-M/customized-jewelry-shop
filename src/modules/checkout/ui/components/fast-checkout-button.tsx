"use client";

import { Button } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { AdminOrderDetails } from "@/modules/admin/orders/types";
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

  // Generate a unique reference for this transaction if none exists
  const generateReference = () => {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const paymentReference = order.paymentReference || generateReference();
  const customerEmail = order.customer?.email || "";

  const initializePayment = usePaystackPayment({
    reference: paymentReference,
    email: customerEmail,
    amount: Math.round(Number(order.totalAmount) * 100), // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  });

  const handlePayment = () => {
    if (!customerEmail) {
      alert("Customer email is required for payment");
      return;
    }

    setIsProcessing(true);

    initializePayment({
      onSuccess: () => {
        // Redirect to success page
        router.push(`/checkout/success?orderNumber=${order.orderNumber}`);
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });
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
        disabled={isProcessing || !customerEmail}
        className="w-full rounded-full py-6 text-lg"
        size="lg"
      >
        {isProcessing ? "Processing Payment..." : "Complete Payment"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Secure payment powered by Paystack
      </p>
    </div>
  );
};

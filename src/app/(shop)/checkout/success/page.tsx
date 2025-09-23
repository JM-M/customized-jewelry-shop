import { CheckoutSuccessView } from "@/modules/checkout/ui/views/checkout-success-view";
import { Suspense } from "react";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<>...</>}>
      <CheckoutSuccessView />
    </Suspense>
  );
}

"use client";

import { Spinner2 } from "@/components/shared/spinner-2";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/modules/cart/contexts";
import { EmptyCartState } from "@/modules/cart/ui/components/empty-cart-state";
import { CheckoutProvider } from "../../contexts/checkout";
import { CheckoutBreadcrumb } from "../components/checkout-breadcrumb";
import { CheckoutStep } from "../components/checkout-step";

// TODO: Sync with checkout session table

export const CheckoutView = () => {
  const session = authClient.useSession();
  const { cart, isLoading: isLoadingCart } = useCart();

  if (session.isPending || isLoadingCart)
    return (
      <div className="flex flex-1 items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );

  if (!cart?.items.length) return <EmptyCartState />;

  return (
    <CheckoutProvider>
      <div className="space-y-4 p-4">
        <CheckoutBreadcrumb />
        <CheckoutStep />
      </div>
    </CheckoutProvider>
  );
};

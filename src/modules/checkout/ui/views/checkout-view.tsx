"use client";

import { Spinner2 } from "@/components/shared/spinner-2";
import { authClient } from "@/lib/auth-client";
import { CheckoutProvider } from "../../contexts/checkout";
import { CheckoutBreadcrumb } from "../components/checkout-breadcrumb";
import { CheckoutStep } from "../components/checkout-step";

export const CheckoutView = () => {
  const session = authClient.useSession();

  if (session.isPending)
    return (
      <div className="flex flex-1 items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );

  return (
    <CheckoutProvider>
      <div className="space-y-2 p-4">
        <CheckoutBreadcrumb />
        <CheckoutStep />
      </div>
    </CheckoutProvider>
  );
};

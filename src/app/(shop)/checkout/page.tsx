import { auth } from "@/lib/auth";
import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order and secure your customized jewelry pieces",
  robots: {
    index: false,
    follow: false,
  },
};

const CheckoutPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return <CheckoutView />;
};
export default CheckoutPage;

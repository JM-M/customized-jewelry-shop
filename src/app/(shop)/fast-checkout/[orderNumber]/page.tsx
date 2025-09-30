import { auth } from "@/lib/auth";
import { FastCheckoutView } from "@/modules/checkout/ui/views/fast-checkout-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const FastCheckoutPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return <FastCheckoutView />;
};

export default FastCheckoutPage;

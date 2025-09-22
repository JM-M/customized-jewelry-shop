import { auth } from "@/lib/auth";
import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

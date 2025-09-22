import { useCheckoutParams } from "../../hooks/use-checkout-params";
import { Delivery } from "./delivery";
import { ReviewAndCheckout } from "./review-and-checkout";

export const CheckoutStep = () => {
  const [checkoutParams] = useCheckoutParams();
  const { step } = checkoutParams;

  if (step === "delivery") return <Delivery />;
  if (step === "review-and-checkout") return <ReviewAndCheckout />;
  return null;
};

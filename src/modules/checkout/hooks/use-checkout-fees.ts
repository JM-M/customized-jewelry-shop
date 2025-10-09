import { useCart } from "@/modules/cart/contexts";
import { useCheckout } from "../contexts/checkout";
import { useCheckoutQueries } from "./use-checkout-queries";

export const useCheckoutFees = () => {
  const { cartSummary } = useCart();
  const { selectedRateId } = useCheckout();
  const { ratesQuery } = useCheckoutQueries();

  const deliveryFee =
    ratesQuery.data?.rates.find((rate) => rate.rate_id === selectedRateId)
      ?.amount || null;

  const subtotal = cartSummary?.subtotal || null;
  const total =
    cartSummary?.subtotal && deliveryFee !== null
      ? cartSummary.subtotal + deliveryFee
      : null;

  return {
    subtotal,
    deliveryFee,
    total,
    hasSubtotal: cartSummary?.subtotal !== undefined,
    hasDeliveryFee: deliveryFee !== null,
    hasTotal: cartSummary?.subtotal !== undefined && deliveryFee !== null,
  };
};

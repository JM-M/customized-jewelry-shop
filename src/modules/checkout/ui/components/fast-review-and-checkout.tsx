import { AdminOrderDetails } from "@/modules/admin/orders/types";
import { FastCheckoutButton } from "./fast-checkout-button";
import { FastDeliveryReview } from "./fast-delivery-review";
import { FastProductsReview } from "./fast-products-review";

interface FastReviewAndCheckoutProps {
  order: AdminOrderDetails;
}

export const FastReviewAndCheckout = ({
  order,
}: FastReviewAndCheckoutProps) => {
  return (
    <div className="mx-auto max-w-[500px] space-y-6">
      <div>
        <FastProductsReview order={order} />
      </div>
      <div>
        <FastDeliveryReview order={order} />
      </div>
      <FastCheckoutButton order={order} />
    </div>
  );
};

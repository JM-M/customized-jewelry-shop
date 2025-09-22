import { CheckoutButton } from "./checkout-button";
import { DeliveryReview } from "./delivery-review";
import { ProductsReview } from "./products-review";

export const ReviewAndCheckout = () => {
  return (
    <div className="space-y-5">
      <h2 className="mb-2 font-serif text-2xl font-medium">Products</h2>
      <ProductsReview />
      <h2 className="mb-2 font-serif text-2xl font-medium">Delivery</h2>
      <DeliveryReview />
      <CheckoutButton />
    </div>
  );
};

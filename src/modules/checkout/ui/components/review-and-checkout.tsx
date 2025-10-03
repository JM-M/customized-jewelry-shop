import { CheckoutButton } from "./checkout-button";
import { DeliveryReview } from "./delivery-review";
import { ProductsReview } from "./products-review";

export const ReviewAndCheckout = () => {
  return (
    <div className="mx-auto max-w-[500px] space-y-6">
      <div>
        {/* <h2 className="mb-2 font-serif text-2xl font-medium">Products</h2> */}
        <ProductsReview />
      </div>
      <div>
        {/* <h2 className="mb-2 font-serif text-2xl font-medium">Delivery</h2> */}
        <DeliveryReview />
      </div>
      <CheckoutButton />
    </div>
  );
};

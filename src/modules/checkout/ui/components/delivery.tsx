import { useCheckoutParams } from "../../hooks/use-checkout-params";
import { DeliveryAddresses } from "./delivery-addresses";
import { DeliveryForm } from "./delivery-form";

export const Delivery = () => {
  const [_, setCheckoutParams] = useCheckoutParams();

  const onProceed = () => setCheckoutParams({ step: "review-and-checkout" });

  return (
    <div className="space-y-5">
      <h2 className="mb-2 font-serif text-2xl font-medium">Saved Addresses</h2>
      <DeliveryAddresses onProceed={onProceed} />
      <h2 className="mb-2 font-serif text-2xl font-medium">Add New Address</h2>
      <DeliveryForm onSubmit={onProceed} />
    </div>
  );
};

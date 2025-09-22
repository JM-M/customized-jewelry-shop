import { DeliveryAddresses } from "./delivery-addresses";
import { DeliveryForm } from "./delivery-form";

export const Delivery = () => {
  const handleDeliverySubmit = async (data: any) => {
    // Handle delivery form submission
    console.log("Delivery data:", data);
    // Here you could integrate with TRPC procedures or other API calls
  };

  return (
    <div className="space-y-5">
      <DeliveryAddresses />
      <DeliveryForm onSubmit={handleDeliverySubmit} />
    </div>
  );
};

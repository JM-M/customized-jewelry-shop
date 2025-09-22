import { DeliveryAddresses } from "./delivery-addresses";
import { DeliveryForm } from "./delivery-form";

export const Delivery = () => {
  const handleDeliverySubmit = async (data: any) => {
    // Handle delivery form submission
    console.log("Delivery data:", data);
    // Here you could integrate with TRPC procedures or other API calls
  };

  const isLoading = false;

  return (
    <div className="space-y-5">
      <h2 className="mb-2 font-serif text-2xl font-medium">Saved Addresses</h2>
      <DeliveryAddresses />
      <h2 className="mb-2 font-serif text-2xl font-medium">Add New Address</h2>
      <DeliveryForm onSubmit={handleDeliverySubmit} />
    </div>
  );
};

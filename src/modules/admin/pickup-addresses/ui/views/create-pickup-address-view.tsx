import { PageHeader } from "@/components/admin/shared/page-header";
import { PickupAddressForm } from "../components/pickup-address-form";

export const CreatePickupAddressView = () => {
  return (
    <div>
      <PageHeader
        title="Create Pickup Address"
        description="Create a new pickup address"
      />
      <PickupAddressForm />
    </div>
  );
};

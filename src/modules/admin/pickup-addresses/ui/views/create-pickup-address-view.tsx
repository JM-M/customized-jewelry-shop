import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { PickupAddressForm } from "../components/pickup-address-form";

export const CreatePickupAddressView = () => {
  return (
    <div>
      <AdminPageHeader
        title="Create Pickup Address"
        description="Create a new pickup address"
      />
      <PickupAddressForm />
    </div>
  );
};

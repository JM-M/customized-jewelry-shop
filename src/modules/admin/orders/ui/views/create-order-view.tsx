"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";

import { CreateOrderForm } from "../components/create-order-form";

export const CreateOrderView = () => {
  return (
    <div>
      <AdminPageHeader
        title="Create Order"
        description="Create a new order for a customer."
      />
      <div className="mt-6">
        <CreateOrderForm />
      </div>
    </div>
  );
};

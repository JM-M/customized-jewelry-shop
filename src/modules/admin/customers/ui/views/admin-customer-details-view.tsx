"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useTRPC } from "@/trpc/client";

import { AdminCustomerDetails } from "../components";

export const AdminCustomerDetailsView = () => {
  const { userId } = useParams();
  const trpc = useTRPC();

  const {
    data: customer,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.users.getUserById.queryOptions({
      userId: userId as string,
    }),
  );

  if (isLoading) {
    return (
      <div>
        <AdminPageHeader
          title="Customer Details"
          description="View customer information and account details."
        />
        <div className="mt-6 flex items-center justify-center gap-2">
          <Spinner2 /> Loading customer details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AdminPageHeader
          title="Customer Details"
          description="View customer information and account details."
        />
        <div className="mt-6 text-center">
          <p className="text-destructive">
            Error loading customer: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div>
        <AdminPageHeader
          title="Customer Details"
          description="View customer information and account details."
        />
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">Customer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={customer.name}
        description={`View and manage details for ${customer.name}`}
      />
      <AdminCustomerDetails customer={customer} />
    </div>
  );
};

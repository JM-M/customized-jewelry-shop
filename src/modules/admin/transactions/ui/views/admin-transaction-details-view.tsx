"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useParams } from "next/navigation";
import { AdminTransactionCustomerInfo } from "../components/admin-transaction-customer-info";
import { AdminTransactionOrderInfo } from "../components/admin-transaction-order-info";
import { AdminTransactionOverview } from "../components/admin-transaction-overview";
import { AdminTransactionPaymentInfo } from "../components/admin-transaction-payment-info";

export const AdminTransactionDetailsView = () => {
  const { paymentReference } = useParams();
  const trpc = useTRPC();

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.transactions.getTransactionByPaymentReference.queryOptions({
      paymentReference: paymentReference as string,
    }),
  );

  if (isLoading) {
    return (
      <div>
        <AdminPageHeader
          title={`Transaction ${paymentReference}`}
          description="View transaction details and payment information."
        />
        <div className="mt-6 flex items-center justify-center gap-2">
          <Spinner2 /> Loading transaction details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AdminPageHeader
          title={`Transaction ${paymentReference}`}
          description="View transaction details and payment information."
        />
        <div className="mt-6 text-center">
          <p className="text-destructive">
            Error loading transaction: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div>
        <AdminPageHeader
          title={`Transaction ${paymentReference}`}
          description="View transaction details and payment information."
        />
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">Transaction not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={`Transaction ${transaction.paymentReference}`}
        description="View transaction details and payment information."
      />

      <div className="@container grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Main Content */}
        <div className="space-y-4 @lg:col-span-3">
          {/* Transaction Overview */}
          <div className="@container">
            <AdminTransactionOverview transaction={transaction} />
          </div>

          {/* Payment Information */}
          <div className="@container">
            <AdminTransactionPaymentInfo transaction={transaction} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="@container space-y-4 @lg:col-span-2">
          {/* Customer Information */}
          <AdminTransactionCustomerInfo transaction={transaction} />

          {/* Related Order */}
          <AdminTransactionOrderInfo transaction={transaction} />
        </div>
      </div>
    </div>
  );
};

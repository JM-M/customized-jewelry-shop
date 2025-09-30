"use client";

import { CopyableText } from "@/components/shared/copyable-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminTransactionCustomerInfoProps {
  transaction: {
    customerEmail: string;
    customerPhone?: string | null;
    customerName?: string | null;
    customer?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  };
}

export const AdminTransactionCustomerInfo = ({
  transaction,
}: AdminTransactionCustomerInfoProps) => {
  // Use customer data from transaction if available, otherwise use snapshot data
  const customerName = transaction.customer?.name || transaction.customerName;
  const customerEmail =
    transaction.customer?.email || transaction.customerEmail;
  const customerId = transaction.customer?.id;

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2">
          <span>👤</span>
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="space-y-3">
          {/* Customer Name */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Name
            </label>
            <div className="text-sm">{customerName || "Not provided"}</div>
          </div>

          {/* Customer Email */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Email
            </label>
            <CopyableText text={customerEmail} />
          </div>

          {/* Customer Phone */}
          {transaction.customerPhone && (
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-medium">
                Phone
              </label>
              <CopyableText text={transaction.customerPhone} />
            </div>
          )}
        </div>

        {/* Note about snapshot data */}
        {!transaction.customer && (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Snapshot Data
                </h3>
                <div className="mt-1 text-sm text-yellow-700">
                  <p>
                    This customer information was captured at the time of the
                    transaction. The customer's current profile may have been
                    updated since then.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

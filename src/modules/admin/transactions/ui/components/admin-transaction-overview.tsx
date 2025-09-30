"use client";

import { CopyableText } from "@/components/shared/copyable-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { formatTransactionDate } from "../utils/transaction-utils";

interface AdminTransactionOverviewProps {
  transaction: {
    id: string;
    paystackTransactionId: number;
    paymentReference: string;
    amount: string;
    currency: string;
    status: string;
    channel?: string | null;
    cardType?: string | null;
    bank?: string | null;
    last4?: string | null;
    fees?: string | null;
    createdAt: string;
    updatedAt: string;
    paidAt?: string | null;
    failedAt?: string | null;
    refundedAt?: string | null;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "refunded":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "partially_refunded":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const AdminTransactionOverview = ({
  transaction,
}: AdminTransactionOverviewProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between">
          Transaction Overview
          <Badge className={getStatusColor(transaction.status)}>
            {transaction.status.replace("_", " ").toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2">
          {/* Payment Reference */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Payment Reference
            </label>
            <CopyableText text={transaction.paymentReference} />
          </div>

          {/* Paystack Transaction ID */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Paystack Transaction ID
            </label>
            <CopyableText text={transaction.paystackTransactionId.toString()} />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Amount
            </label>
            <div className="text-lg font-semibold">
              {formatCurrency(
                parseFloat(transaction.amount),
                transaction.currency,
              )}
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Currency
            </label>
            <div className="text-sm font-medium">
              {transaction.currency.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="border-t pt-4">
          <h4 className="mb-3 font-medium">Timeline</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{formatTransactionDate(transaction.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span>{formatTransactionDate(transaction.updatedAt)}</span>
            </div>
            {transaction.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid:</span>
                <span>{formatTransactionDate(transaction.paidAt)}</span>
              </div>
            )}
            {transaction.failedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Failed:</span>
                <span>{formatTransactionDate(transaction.failedAt)}</span>
              </div>
            )}
            {transaction.refundedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Refunded:</span>
                <span>{formatTransactionDate(transaction.refundedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

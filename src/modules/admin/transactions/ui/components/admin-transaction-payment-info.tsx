"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatCurrency } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  getChannelDisplayName,
  getChannelIcon,
} from "../utils/transaction-utils";

interface AdminTransactionPaymentInfoProps {
  transaction: {
    amount: string;
    amountInKobo: number;
    currency: string;
    channel?: string | null;
    cardType?: string | null;
    bank?: string | null;
    last4?: string | null;
    fees?: string | null;
    feesBreakdown?: Array<{
      fee_type: string;
      fee_amount: number;
      fee_percentage: number;
      fee_description: string;
    }> | null;
    gatewayResponse?: string | null;
    message?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

export const AdminTransactionPaymentInfo = ({
  transaction,
}: AdminTransactionPaymentInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="gap-3 p-3">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="hover:bg-muted/50 cursor-pointer p-0 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{getChannelIcon(transaction.channel)}</span>
                Payment Information
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 p-0">
            {/* Payment Method Details */}
            <div className="space-y-3">
              <h4 className="font-medium">Payment Method</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Channel:
                  </span>
                  <Badge variant="outline">
                    {getChannelDisplayName(transaction.channel)}
                  </Badge>
                </div>

                {transaction.cardType && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Card Type:
                    </span>
                    <Badge variant="outline">
                      {transaction.cardType.toUpperCase()}
                    </Badge>
                  </div>
                )}

                {transaction.bank && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Bank:</span>
                    <span className="text-sm">{transaction.bank}</span>
                  </div>
                )}

                {transaction.last4 && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      Last 4 digits:
                    </span>
                    <span className="font-mono text-sm">
                      •••• {transaction.last4}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Amount Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium">Amount Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      parseFloat(transaction.amount),
                      transaction.currency,
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Amount (Kobo):
                  </span>
                  <span className="font-mono text-sm">
                    {transaction.amountInKobo.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Fees:</span>
                  <span className="text-sm">
                    {transaction.fees
                      ? formatCurrency(
                          parseFloat(transaction.fees),
                          transaction.currency,
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Fees Breakdown */}
            {transaction.feesBreakdown &&
              transaction.feesBreakdown.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Fees Breakdown</h4>
                  <div className="space-y-2">
                    {transaction.feesBreakdown.map((fee, index) => (
                      <div key={index} className="rounded-md border p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-medium">
                              {fee.fee_type}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {fee.fee_description}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatCurrency(
                                fee.fee_amount,
                                transaction.currency,
                              )}
                            </div>
                            {fee.fee_percentage > 0 && (
                              <div className="text-muted-foreground text-xs">
                                {fee.fee_percentage}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Technical Details */}
            <div className="space-y-3">
              <h4 className="font-medium">Technical Details</h4>
              <div className="space-y-2">
                {transaction.ipAddress && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">
                      IP Address:
                    </span>
                    <span className="font-mono text-sm">
                      {transaction.ipAddress}
                    </span>
                  </div>
                )}

                {transaction.userAgent && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-sm">
                      User Agent:
                    </span>
                    <div className="bg-muted rounded p-2 font-mono text-xs break-all">
                      {transaction.userAgent}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gateway Response */}
            {transaction.gatewayResponse && (
              <div className="space-y-3">
                <h4 className="font-medium">Gateway Response</h4>
                <div className="bg-muted rounded p-3 font-mono text-xs break-all">
                  {transaction.gatewayResponse}
                </div>
              </div>
            )}

            {/* Message */}
            {transaction.message && (
              <div className="space-y-3">
                <h4 className="font-medium">Message</h4>
                <div className="bg-muted rounded p-3 text-sm">
                  {transaction.message}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

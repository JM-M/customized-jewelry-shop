"use client";

import { CopyableText } from "@/components/shared/copyable-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Mail, User } from "lucide-react";

import { AdminOrderCustomer } from "../../../types";

interface AdminOrderCustomerInfoProps {
  customer: AdminOrderCustomer;
}

export const AdminOrderCustomerInfo = ({
  customer,
}: AdminOrderCustomerInfoProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="px-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Customer Information
          </CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 size-4" />
            View Profile
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-0">
        {/* Customer Details */}
        <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="text-muted-foreground size-4" />
              <p className="text-sm font-medium text-gray-900">Customer Name</p>
            </div>
            <p className="text-muted-foreground text-sm">
              {customer?.name || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="text-muted-foreground size-4" />
              <p className="text-sm font-medium text-gray-900">Email Address</p>
            </div>
            <CopyableText text={customer?.email || "N/A"} />
          </div>
        </div>

        {/* Customer ID */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">Customer ID</p>
          <CopyableText text={customer?.id || "N/A"} />
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-3">
          <div className="flex flex-col gap-2 @min-[400px]:flex-row @min-[400px]:justify-end">
            <Button variant="outline" size="sm">
              <Mail className="size-4" />
              Send Email
            </Button>
            <Button variant="outline" size="sm">
              <User className="size-4" />
              View Orders
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

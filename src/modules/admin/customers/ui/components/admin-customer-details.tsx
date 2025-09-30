"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminUser } from "@/modules/admin/customers/types";

interface AdminCustomerDetailsProps {
  customer: AdminUser;
}

const RoleBadge = ({ role }: { role: AdminUser["role"] }) => {
  const roleConfig = {
    user: { label: "Customer", variant: "secondary" as const },
    admin: { label: "Admin", variant: "default" as const },
    super_admin: { label: "Super Admin", variant: "destructive" as const },
  };

  const config = roleConfig[role];

  return (
    <Badge variant={config.variant} className="text-sm">
      {config.label}
    </Badge>
  );
};

const EmailVerifiedBadge = ({ verified }: { verified: boolean }) => {
  return (
    <Badge variant={verified ? "default" : "secondary"} className="text-sm">
      {verified ? "Verified" : "Unverified"}
    </Badge>
  );
};

export const AdminCustomerDetails = ({
  customer,
}: AdminCustomerDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Profile Section */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={customer.image || undefined} />
            <AvatarFallback className="text-lg">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{customer.name}</h3>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Email Address
              </label>
              <p className="text-sm">{customer.email}</p>
            </div>

            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Account Created
              </label>
              <p className="text-sm">
                {new Date(customer.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div>
              <label className="text-muted-foreground text-sm font-medium">
                Last Updated
              </label>
              <p className="text-sm">
                {new Date(customer.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Role:</span>
              <RoleBadge role={customer.role} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Status:</span>
              <EmailVerifiedBadge verified={customer.emailVerified} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account Status:</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

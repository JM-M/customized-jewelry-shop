"use client";

import {
  createActionsColumn,
  createSelectColumn,
  DateCell,
  SortableHeader,
} from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AdminUser } from "@/modules/admin/customers/types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

const CustomerNameCell = ({ customer }: { customer: AdminUser }) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={customer.image || undefined} />
        <AvatarFallback>
          {customer.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <div
          className="cursor-pointer font-medium underline"
          onClick={() => router.push(`/admin/customers/${customer.id}`)}
        >
          {customer.name}
        </div>
        <div className="text-muted-foreground text-sm">{customer.email}</div>
      </div>
    </div>
  );
};

const RoleCell = ({ role }: { role: AdminUser["role"] }) => {
  const roleConfig = {
    user: { label: "Customer", variant: "secondary" as const },
    admin: { label: "Admin", variant: "default" as const },
    super_admin: { label: "Super Admin", variant: "destructive" as const },
  };

  const config = roleConfig[role];

  return (
    <Badge variant={config.variant} className="text-xs">
      {config.label}
    </Badge>
  );
};

const EmailVerifiedCell = ({ verified }: { verified: boolean }) => {
  return (
    <Badge variant={verified ? "default" : "secondary"} className="text-xs">
      {verified ? "Verified" : "Unverified"}
    </Badge>
  );
};

export const columns: ColumnDef<AdminUser>[] = [
  createSelectColumn<AdminUser>(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Customer</SortableHeader>
    ),
    cell: ({ row }) => <CustomerNameCell customer={row.original} />,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <SortableHeader column={column}>Role</SortableHeader>
    ),
    cell: ({ row }) => <RoleCell role={row.getValue("role")} />,
  },
  {
    accessorKey: "emailVerified",
    header: "Email Status",
    cell: ({ row }) => (
      <EmailVerifiedCell verified={row.getValue("emailVerified")} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Joined</SortableHeader>
    ),
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
  createActionsColumn<AdminUser>({
    actions: [
      {
        label: "Copy user ID",
        onClick: (customer) => navigator.clipboard.writeText(customer.id),
      },
      {
        label: "Copy email",
        onClick: (customer) => navigator.clipboard.writeText(customer.email),
        separator: true,
      },
      {
        label: "View profile",
        onClick: () => {},
      },
      {
        label: "Edit user",
        onClick: () => {},
      },
      {
        label: "Delete user",
        onClick: () => {},
        className: "text-red-600",
      },
    ],
  }),
];

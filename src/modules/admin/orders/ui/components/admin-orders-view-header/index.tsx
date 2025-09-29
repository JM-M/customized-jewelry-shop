"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export const AdminOrdersViewHeader = () => {
  return (
    <div className="flex justify-end">
      <Button asChild>
        <Link href="/admin/orders/create">
          <PlusIcon /> Create Order
        </Link>
      </Button>
    </div>
  );
};

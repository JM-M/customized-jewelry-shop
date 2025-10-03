"use client";

import { GiftIcon, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const QuickActions = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quick Actions</h3>

      <div className="flex gap-3">
        <Button asChild variant="outline" className="h-16 flex-1">
          <Link href="/admin/products/create">
            <GiftIcon className="mr-2 h-4 w-4" />
            Create Product
          </Link>
        </Button>

        <Button asChild className="h-16 flex-1">
          <Link href="/admin/orders/create">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Create Order
          </Link>
        </Button>
      </div>
    </div>
  );
};

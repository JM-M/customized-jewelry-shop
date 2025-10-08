"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export const AdminProductsViewHeader = () => {
  return (
    <div className="flex justify-end">
      <Button asChild>
        <Link href="/admin/products/create">
          <PlusIcon /> Create Product
        </Link>
      </Button>
    </div>
  );
};

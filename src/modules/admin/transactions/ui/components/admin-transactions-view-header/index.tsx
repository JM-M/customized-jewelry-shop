"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon, FilterIcon } from "lucide-react";

export const AdminTransactionsViewHeader = () => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <FilterIcon className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <DownloadIcon className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

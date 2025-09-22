"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionItem {
  label: string;
  onClick: (item: any) => void;
  className?: string;
  separator?: boolean;
}

interface ActionsColumnProps<TData> {
  actions: ActionItem[];
  label?: string;
}

export function createActionsColumn<TData>({
  actions,
  label = "Actions",
}: ActionsColumnProps<TData>): ColumnDef<TData> {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            {actions.map((action, index) => (
              <div key={index}>
                {action.separator && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  className={action.className}
                  onClick={() => action.onClick(item)}
                >
                  {action.label}
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
}

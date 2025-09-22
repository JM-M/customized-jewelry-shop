"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  createActionsColumn,
  createSelectColumn,
  DateCell,
  PriceCell,
  SkuCell,
  SortableHeader,
  StockCell,
} from "@/components/shared";
import { AdminGetProductsOutput } from "@/modules/admin/admin-products/types";

type Product = AdminGetProductsOutput["items"][0];

export const columns: ColumnDef<Product>[] = [
  createSelectColumn<Product>(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <SkuCell value={row.getValue("sku")} />,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <SortableHeader column={column}>Price</SortableHeader>
    ),
    cell: ({ row }) => <PriceCell value={row.getValue("price")} />,
  },
  {
    accessorKey: "stockQuantity",
    header: ({ column }) => (
      <SortableHeader column={column}>Stock</SortableHeader>
    ),
    cell: ({ row }) => <StockCell value={row.getValue("stockQuantity")} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Created</SortableHeader>
    ),
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
  createActionsColumn<Product>({
    actions: [
      {
        label: "Copy product ID",
        onClick: (product) => navigator.clipboard.writeText(product.id),
      },
      {
        label: "View details",
        onClick: () => {},
        separator: true,
      },
      {
        label: "Edit product",
        onClick: () => {},
      },
      {
        label: "Delete product",
        onClick: () => {},
        className: "text-red-600",
      },
    ],
  }),
];

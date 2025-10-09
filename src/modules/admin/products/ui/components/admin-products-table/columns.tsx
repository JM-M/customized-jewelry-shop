"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  createActionsColumn,
  createSelectColumn,
  DateCell,
  PriceCell,
  SortableHeader,
} from "@/components/shared";
import { AdminGetProductsOutput } from "@/modules/admin/products/types";

type Product = AdminGetProductsOutput["items"][number];

const ProductNameCell = ({ product }: { product: Product }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin/products/${product.slug}`);
  };

  return (
    <div
      className="cursor-pointer font-medium transition-colors hover:text-blue-600 hover:underline"
      onClick={handleClick}
    >
      {product.name}
    </div>
  );
};

export const columns: ColumnDef<Product>[] = [
  createSelectColumn<Product>(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    cell: ({ row }) => <ProductNameCell product={row.original} />,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <SortableHeader column={column}>Price</SortableHeader>
    ),
    cell: ({ row }) => <PriceCell value={row.getValue("price")} />,
  },
  {
    id: "materials",
    header: "Materials",
    cell: ({ row }) => {
      const product = row.original;
      const materialsCount = product.materials?.length || 0;
      return (
        <div className="text-muted-foreground text-sm">
          {materialsCount} variant{materialsCount !== 1 ? "s" : ""}
        </div>
      );
    },
  },
  {
    id: "totalStock",
    header: "Total Stock",
    cell: ({ row }) => {
      const product = row.original;
      const totalStock =
        product.materials?.reduce(
          (sum, m) => sum + (m.stockQuantity || 0),
          0,
        ) || 0;
      return (
        <div className="text-sm">
          <span
            className={
              totalStock > 0 ? "text-green-600" : "text-muted-foreground"
            }
          >
            {totalStock} items
          </span>
        </div>
      );
    },
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

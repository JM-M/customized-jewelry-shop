"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  createActionsColumn,
  createSelectColumn,
  DateCell,
  SortableHeader,
} from "@/components/shared";
import { GetAllCategoriesOutput } from "@/modules/categories/types";

type Category = GetAllCategoriesOutput[number];

const CategoryNameCell = ({ category }: { category: Category }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin/categories/${category.slug}`);
  };

  return (
    <div
      className="cursor-pointer font-medium transition-colors hover:text-blue-600 hover:underline"
      onClick={handleClick}
    >
      {category.name}
    </div>
  );
};

const CategoryStatusCell = ({ category }: { category: Category }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        category.isActive
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {category.isActive ? "Active" : "Inactive"}
    </span>
  );
};

export const columns: ColumnDef<Category>[] = [
  createSelectColumn<Category>(),
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    cell: ({ row }) => <CategoryNameCell category={row.original} />,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <div className="font-mono text-sm text-gray-600">
        {row.getValue("slug")}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    cell: ({ row }) => <CategoryStatusCell category={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Created</SortableHeader>
    ),
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
  createActionsColumn<Category>({
    actions: [
      {
        label: "Copy category ID",
        onClick: (category) => navigator.clipboard.writeText(category.id),
      },
      {
        label: "View category",
        onClick: (category) =>
          window.open(`/categories/${category.slug}`, "_blank"),
        separator: true,
      },
      {
        label: "Edit category",
        onClick: () => {},
      },
      {
        label: "Delete category",
        onClick: () => {},
        className: "text-red-600",
      },
    ],
  }),
];

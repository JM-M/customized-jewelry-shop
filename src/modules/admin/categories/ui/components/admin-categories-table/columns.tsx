"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  createSelectColumn,
  DateCell,
  SortableHeader,
  Spinner,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { GetAllCategoriesOutput } from "@/modules/categories/types";
import { TrashIcon } from "lucide-react";

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

const CategoryActionsCell = ({
  category,
  onEdit,
  onDelete,
  isDeleting,
  deletingCategoryId,
}: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isDeleting: boolean;
  deletingCategoryId?: string;
}) => {
  const isThisCategoryDeleting =
    isDeleting && deletingCategoryId === category.id;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(category)}
        disabled={isThisCategoryDeleting}
      >
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(category)}
        className="text-red-600 hover:text-red-700"
        disabled={isThisCategoryDeleting}
      >
        {isThisCategoryDeleting ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <TrashIcon className="h-4 w-4" />
        )}
      </Button>
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

export const createColumns = (
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void,
  isDeleting: boolean,
  deletingCategoryId?: string,
): ColumnDef<Category>[] => [
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <CategoryActionsCell
        category={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeleting={isDeleting}
        deletingCategoryId={deletingCategoryId}
      />
    ),
  },
];

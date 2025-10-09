"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GetAllCategoriesOutput } from "@/modules/categories/types";
import {
  CalendarIcon,
  Edit,
  ExternalLinkIcon,
  Eye,
  HistoryIcon,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryOverviewCardProps {
  category: GetAllCategoriesOutput[number];
  parentCategory?: GetAllCategoriesOutput[number] | null;
  onEdit?: () => void;
}

export const CategoryOverviewCard = ({
  category,
  onEdit,
}: CategoryOverviewCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative flex flex-col gap-3">
        {/* Category Image */}
        <div className="relative h-48 w-full">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant={category.isActive ? "default" : "secondary"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <CardHeader className="px-3">
          {/* Category Name */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-medium">{category.name}</h1>
              {/* Breadcrumb */}
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/categories/${category.slug}`}>
                    <Eye className="mr-2 size-4" />
                    View Public Page
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="mr-2 size-4" />
                  Edit Category
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 size-4" />
                  Delete Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </CardHeader>

        <CardContent className="px-3 pb-3">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-muted-foreground size-4" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground">
                  {formatDate(new Date(category.createdAt))}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HistoryIcon className="text-muted-foreground size-4" />
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">
                  {formatDate(new Date(category.updatedAt))}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-5 flex flex-col items-center justify-end gap-3 min-[400px]:flex-row">
            <Button
              className="w-full min-[400px]:w-fit"
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/categories/${category.slug}`}>
                <ExternalLinkIcon />
                View Public
              </Link>
            </Button>
            <Button
              className="w-full min-[400px]:w-fit"
              size="sm"
              onClick={onEdit}
            >
              <Edit />
              Edit Category
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

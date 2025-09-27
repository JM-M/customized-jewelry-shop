"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Eye, MoreHorizontal, Package, Plus, Trash2 } from "lucide-react";
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
import { GetCategoryWithSubcategoriesOutput } from "../../types";

interface SubcategoriesSectionProps {
  subcategories: GetCategoryWithSubcategoriesOutput["subcategories"];
  categorySlug: string;
}

const SubcategoryCard = ({
  subcategory,
  categorySlug,
}: {
  subcategory: GetCategoryWithSubcategoriesOutput["subcategories"][number];
  categorySlug: string;
}) => {
  return (
    <Card className="group p-0 transition-shadow hover:shadow-md">
      <div className="relative flex h-full flex-col">
        {/* Subcategory Image */}
        <div className="relative h-32 w-full">
          <Image
            src={subcategory.image}
            alt={subcategory.name}
            fill
            className="rounded-t-lg object-cover"
          />
          <div className="absolute inset-0 rounded-t-lg bg-gradient-to-t from-black/60 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={subcategory.isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {subcategory.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <CardContent className="flex-1 p-4">
          {/* Subcategory Info */}
          <div className="flex h-full flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold">{subcategory.name}</h3>
                <p className="text-muted-foreground truncate text-sm">
                  /{subcategory.slug}
                </p>
              </div>

              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/admin/categories/${categorySlug}/${subcategory.slug}`}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Manage
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/categories/${categorySlug}/${subcategory.slug}`}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Public
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            {subcategory.description && (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {subcategory.description}
              </p>
            )}

            {/* Stats */}
            <div className="text-muted-foreground mt-auto flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Package className="h-3 w-3" />
                <span className="text-nowrap">
                  {subcategory.productCount || 0} products
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span>
                  Created {new Date(subcategory.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export const SubcategoriesSection = ({
  subcategories,
  categorySlug,
}: SubcategoriesSectionProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <CardTitle>Subcategories</CardTitle>
            <p className="text-muted-foreground text-sm">
              Manage child categories under {categorySlug}
            </p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto w-fit">
            <Plus />
            Add Subcategory
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {subcategories.length > 0 ? (
          <div className="grid gap-4 min-[500px]:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((subcategory) => (
              <SubcategoryCard
                key={subcategory.id}
                subcategory={subcategory}
                categorySlug={categorySlug}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Package className="text-muted-foreground mx-auto h-12 w-12" />
            <h3 className="text-muted-foreground mt-4 text-sm font-medium">
              No subcategories
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Get started by creating a new subcategory.
            </p>
            <Button size="sm" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Subcategory
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

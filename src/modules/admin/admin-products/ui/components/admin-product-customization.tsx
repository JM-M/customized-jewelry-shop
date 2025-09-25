"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalize } from "lodash-es";
import { PlusCircleIcon } from "lucide-react";

import { useAdminProduct } from "../../contexts/admin-product";
import { CUSTOMIZATION_OPTIONS } from "../../constants";
import { ProductCustomizationOption } from "./product-customization-option";

export const AdminProductCustomization = () => {
  const { product } = useAdminProduct();

  if (!product) {
    return null;
  }
  const emptyContent = (
    <div className="py-8 text-center">
      <div className="text-muted-foreground">
        <p>No customization options configured yet.</p>
        <p className="mt-2 text-sm">
          Add materials, engraving areas, and other customization options to
          allow customers to personalize this product.
        </p>
      </div>
    </div>
  );

  const isEmpty = false;

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">Customization Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        {isEmpty ? (
          emptyContent
        ) : (
          <>
            <ProductCustomizationOption type="material" />
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mt-6 ml-auto flex">
              <PlusCircleIcon className="size-4" />
              Add Customization Option
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {CUSTOMIZATION_OPTIONS.map((option) => (
              <DropdownMenuItem key={option}>
                {capitalize(option).replaceAll("_", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
};

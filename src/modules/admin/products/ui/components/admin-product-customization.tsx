"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { useAdminProduct } from "../../contexts/admin-product";
import { AddCustomizationForm } from "./add-customization-form";
import { CustomizationOptionItem } from "./product-customization-option/customization-option-item";

export const AdminProductCustomization = () => {
  const {
    product,
    customizationOptions,
    isCustomizationOptionsLoading,
    removeCustomizationOption,
    isRemovingCustomizationOption,
  } = useAdminProduct();

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

  const isEmpty =
    !isCustomizationOptionsLoading && customizationOptions.length === 0;

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">Customization Options</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-0">
        {isCustomizationOptionsLoading ? (
          <div className="py-8 text-center">
            <div className="text-muted-foreground">
              Loading customization options...
            </div>
          </div>
        ) : isEmpty ? (
          emptyContent
        ) : (
          <div className="space-y-3">
            {customizationOptions.map((option) => (
              <CustomizationOptionItem
                key={option.id}
                option={option}
                onRemove={() => removeCustomizationOption(option.id)}
                isRemoving={isRemovingCustomizationOption}
              />
            ))}
          </div>
        )}
        <Separator />
        <AddCustomizationForm />
      </CardContent>
    </Card>
  );
};

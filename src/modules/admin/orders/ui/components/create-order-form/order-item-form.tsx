"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { ProductSearchCommand } from "@/components/admin/shared";
import { OrderItemCustomization } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CustomizationContent } from "@/modules/products/types";
import { useTRPC } from "@/trpc/client";

import { OrderItemsFormValues } from "./schemas";

type OrderItem = OrderItemsFormValues["items"][0];

interface OrderItemFormProps {
  item: OrderItem;
  onUpdate: (id: string, field: string, value: any) => void;
  onSave: (itemData: OrderItem) => void;
  onCancel: () => void;
  isEditing?: boolean;
  className?: string;
  excludeProductIds?: string[];
}

export const OrderItemForm = ({
  item,
  onUpdate,
  onSave,
  onCancel,
  isEditing = false,
  className = "",
  excludeProductIds = [],
}: OrderItemFormProps) => {
  const trpc = useTRPC();
  const productSearchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState(
    item.productId ? "Selected Product" : "",
  );
  const [customizations, setCustomizations] = useState<
    Record<string, CustomizationContent>
  >(item.customizations || {});

  // Local state for form data
  const [formData, setFormData] = useState<OrderItem>(item);

  // Get customization options for the selected product
  const { data: customizationOptions, isLoading: isCustomizationLoading } =
    useQuery(
      trpc.products.getProductCustomizationOptions.queryOptions(
        {
          productId: formData.productId,
        },
        {
          enabled: !!formData.productId,
        },
      ),
    );

  // Handle customization changes
  const handleCustomizationChange = (
    optionId: string,
    content: CustomizationContent,
  ) => {
    const newCustomizations = {
      ...customizations,
      [optionId]: content,
    };
    setCustomizations(newCustomizations);
    const updatedFormData = { ...formData, customizations: newCustomizations };
    setFormData(updatedFormData);
    if (isEditing) {
      onUpdate(item.id, "customizations", newCustomizations);
    }
  };

  const handleProductSelect = (product: { id: string; name: string }) => {
    const updatedFormData = { ...formData, productId: product.id };
    setFormData(updatedFormData);
    setSearchQuery(product.name);
    if (isEditing) {
      onUpdate(item.id, "productId", product.id);
    }
  };

  const handleSave = () => {
    const itemToSave = {
      ...formData,
      id: formData.id === "new" ? Date.now().toString() : formData.id,
    };
    onSave(itemToSave);

    // Clear form if adding new item (not editing)
    if (!isEditing) {
      const emptyItem: OrderItem = {
        id: "new",
        productId: "",
        materialId: "",
        quantity: 1,
        unitPrice: 0,
        engravings: {},
        notes: "",
        customizations: {},
      };
      setFormData(emptyItem);
      setSearchQuery("");
      setCustomizations({});
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label>Product</Label>
        <ProductSearchCommand
          ref={productSearchRef}
          onProductSelect={handleProductSelect}
          onInputChange={setSearchQuery}
          initialValue={searchQuery}
          excludeProductIds={excludeProductIds}
        />
      </div>

      {/* Show customization UI when a product is selected */}
      {formData.productId && customizationOptions && (
        <OrderItemCustomization
          customizationOptions={customizationOptions}
          customizations={customizations}
          onCustomizationChange={handleCustomizationChange}
          title="Customize This Item"
          defaultOpen
        />
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!formData.productId}>
          {isEditing ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </div>
  );
};

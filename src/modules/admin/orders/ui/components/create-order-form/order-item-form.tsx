/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { ProductSearchCommand } from "@/components/admin/shared/product-search-command";
import {
  OrderItemCustomization,
  OrderItemMaterialSelect,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNaira } from "@/lib/utils";
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
  const [searchQuery, setSearchQuery] = useState(item.productName || "");
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

  // Get product materials for the selected product
  const { data: productMaterials, isLoading: isMaterialsLoading } = useQuery(
    trpc.products.getProductMaterials.queryOptions(
      {
        productId: formData.productId,
      },
      {
        enabled: !!formData.productId,
      },
    ),
  );

  // Calculate unit price based on selected material
  const selectedProductMaterial = productMaterials?.find(
    (pm) => pm.materialId === formData.materialId,
  );
  const calculatedUnitPrice = selectedProductMaterial
    ? Number(selectedProductMaterial.price)
    : 0;

  // Calculate total price (base price only - customization costs not supported in current type)
  const totalPrice = calculatedUnitPrice * formData.quantity;

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

  // Handle quantity changes
  const handleQuantityChange = (quantity: number) => {
    const updatedFormData = { ...formData, quantity };
    setFormData(updatedFormData);
    if (isEditing) {
      onUpdate(item.id, "quantity", quantity);
    }
  };

  // Handle material changes
  const handleMaterialChange = (materialId: string | null) => {
    const newMaterialId = materialId || "";
    const selectedMaterial = productMaterials?.find(
      (pm) => pm.materialId === newMaterialId,
    );
    const newUnitPrice = selectedMaterial ? Number(selectedMaterial.price) : 0;

    const updatedFormData = {
      ...formData,
      materialId: newMaterialId,
      unitPrice: newUnitPrice,
    };
    setFormData(updatedFormData);
    if (isEditing) {
      onUpdate(item.id, "materialId", newMaterialId);
      onUpdate(item.id, "unitPrice", newUnitPrice);
    }
  };

  const handleProductSelect = (product: { id: string; name: string }) => {
    const updatedFormData = {
      ...formData,
      productId: product.id,
      productName: product.name, // Store product name
      materialId: "", // Reset material selection
      unitPrice: 0, // Reset unit price
    };
    setFormData(updatedFormData);
    setSearchQuery(product.name);
    if (isEditing) {
      onUpdate(item.id, "productId", product.id);
      onUpdate(item.id, "productName", product.name);
      onUpdate(item.id, "materialId", "");
      onUpdate(item.id, "unitPrice", 0);
    }
  };

  const handleSave = () => {
    const itemToSave = {
      ...formData,
      id: formData.id === "new" ? Date.now().toString() : formData.id,
      unitPrice: calculatedUnitPrice, // Use calculated unit price
    };
    onSave(itemToSave);

    // Clear form if adding new item (not editing)
    if (!isEditing) {
      const emptyItem: OrderItem = {
        id: "new",
        productId: "",
        productName: "", // Add product name to empty item
        materialId: "",
        quantity: 1,
        unitPrice: 0,
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

      {/* Show material selection when a product is selected */}
      {formData.productId && productMaterials && (
        <OrderItemMaterialSelect
          productMaterials={productMaterials}
          selectedMaterialId={formData.materialId}
          onMaterialChange={handleMaterialChange}
        />
      )}

      {/* Quantity field */}
      <div className="space-y-2">
        <Label>Quantity</Label>
        <Input
          type="number"
          min="1"
          value={formData.quantity}
          onChange={(e) => handleQuantityChange(Number(e.target.value))}
          className="w-24"
        />
      </div>

      {/* Price display */}
      {formData.productId && formData.materialId && (
        <div className="space-y-2 rounded-lg border bg-gray-50 p-3 dark:bg-gray-800">
          <div className="flex justify-between text-sm">
            <span>Unit Price:</span>
            <span className="font-medium">
              {formatNaira(calculatedUnitPrice)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Quantity:</span>
            <span className="font-medium">{formData.quantity}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-semibold">
            <span>Total Price:</span>
            <span>{formatNaira(totalPrice)}</span>
          </div>
        </div>
      )}

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
        {!!onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={!formData.productId}
        >
          {isEditing ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </div>
  );
};

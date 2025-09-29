"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { formatNaira } from "@/lib/utils";
import { OrderItemDisplayCard } from "./order-item-display-card";
import { OrderItemForm } from "./order-item-form";
import { OrderItemsFormValues } from "./schemas";

type OrderItem = OrderItemsFormValues["items"][0];

export const OrderItemsFields = () => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<OrderItemsFormValues>();

  // State management for edit mode
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const items = watch("items") || [];

  // Get list of already selected product IDs (excluding the one being edited)
  const selectedProductIds = items
    .filter((item) => item.id !== editingItemId && item.productId)
    .map((item) => item.productId);

  const removeItem = (id: string) => {
    setValue(
      "items",
      items.filter((item) => item.id !== id),
    );
    // If we're editing the item being removed, exit edit mode
    if (editingItemId === id) {
      setEditingItemId(null);
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    setValue(
      "items",
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleEdit = (id: string) => {
    setEditingItemId(id);
  };

  const handleSave = (itemData?: OrderItem) => {
    if (itemData) {
      if (editingItemId) {
        // Update existing item
        setValue(
          "items",
          items.map((item) => (item.id === editingItemId ? itemData : item)),
        );
      } else {
        // Add new item
        setValue("items", [...items, itemData]);
      }
    }
    setEditingItemId(null);
  };

  const handleCancel = () => {
    setEditingItemId(null);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle>Order Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        {/* Display existing items */}
        {items.map((item, index) => {
          const isEditing = editingItemId === item.id;

          if (isEditing) {
            return (
              <div
                key={`edit-${item.id}`}
                className="animate-in slide-in-from-top-2 duration-200"
              >
                <OrderItemForm
                  item={item}
                  onUpdate={updateItem}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  isEditing={true}
                  className="rounded-lg border p-4"
                  excludeProductIds={selectedProductIds}
                />
              </div>
            );
          }

          return (
            <div
              key={`display-${item.id}`}
              className="animate-in slide-in-from-bottom-2 duration-200"
            >
              <OrderItemDisplayCard
                item={item}
                index={index}
                canRemove={true}
                onEdit={handleEdit}
                onRemove={removeItem}
              />
            </div>
          );
        })}

        {/* Add new item form */}
        <div className="animate-in slide-in-from-top-2 mt-8 flex flex-col gap-3 border p-3 duration-200">
          <h3 className="text-lg font-medium">Add New Item</h3>

          <OrderItemForm
            item={{
              id: "new",
              productId: "",
              materialId: "",
              quantity: 1,
              unitPrice: 0,
              engravings: {},
              notes: "",
              customizations: {},
            }}
            onUpdate={(id, field, value) => {
              // For new items, we'll store the data temporarily
              // This will be handled by the form component itself
            }}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={false}
            excludeProductIds={selectedProductIds}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal:</span>
            <span>{formatNaira(subtotal)}</span>
          </div>
        </div>

        {errors.items && (
          <span className="text-destructive text-sm">
            {errors.items.message}
          </span>
        )}
      </CardContent>
    </Card>
  );
};

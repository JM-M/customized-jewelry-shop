"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { CartItemCard } from "@/modules/cart/ui/components/cart-item-card";

import { AdminOrderItem } from "../../../types";

interface AdminOrderItemsProps {
  items: AdminOrderItem[];
}

// Transform AdminOrderItem to minimal structure for CartItemCard
const transformAdminOrderItemToMinimalCartItem = (
  adminOrderItem: AdminOrderItem,
) => {
  return {
    product: {
      price: adminOrderItem.unitPrice,
      primaryImage:
        adminOrderItem.product?.primaryImage || "/images/sample-product/1.jpg",
      name: adminOrderItem.product?.name || "Unknown Product",
    },
    quantity: adminOrderItem.quantity,
    customizations: adminOrderItem.customizations || {},
    material: adminOrderItem.material
      ? {
          name: adminOrderItem.material.name,
          hexColor: adminOrderItem.material.hexColor,
        }
      : null,
  };
};

export const AdminOrderItems = ({ items }: AdminOrderItemsProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Order Items ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-5">
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={transformAdminOrderItemToMinimalCartItem(item)}
              hideCounter
              hideCustomizations
            />
          ))}
        </div>

        {/* Order Items Summary */}
        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
            <div className="flex items-center justify-start gap-2 text-sm font-medium">
              <span>Total Items:</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex items-center justify-start gap-2 text-sm font-medium">
              <span>Customization Fees:</span>
              <span>
                {formatNaira(
                  items.reduce((sum, item) => {
                    if (item.customizations) {
                      return (
                        sum +
                        Object.values(item.customizations).reduce(
                          (customizationSum, customization) =>
                            customizationSum +
                            (customization.additionalPrice || 0) *
                              item.quantity,
                          0,
                        )
                      );
                    }
                    return sum;
                  }, 0),
                )}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

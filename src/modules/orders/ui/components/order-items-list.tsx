import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem } from "@/modules/cart/types";
import { CartItemCard } from "@/modules/cart/ui/components/cart-item-card";
import { GetUserOrderOutput } from "@/modules/orders/types";

interface OrderItemsListProps {
  order: GetUserOrderOutput;
}

// Transform order item to CartItem structure
const transformOrderItemToCartItem = (
  orderItem: GetUserOrderOutput["items"][number],
): CartItem => {
  return {
    id: orderItem.id,
    cartId: "", // Not needed for display
    productId: orderItem.productId,
    materialId: orderItem.materialId,
    quantity: orderItem.quantity,
    price: orderItem.unitPrice, // Map unitPrice to price
    customizations: orderItem.customizations || {},
    notes: orderItem.notes,
    createdAt: orderItem.createdAt,
    updatedAt: orderItem.createdAt, // Use createdAt as fallback
    product: {
      ...orderItem.product,
      materials: [], // Empty array as it's not available in order items
    },
    material: orderItem.material,
  };
};

export const OrderItemsList = ({ order }: OrderItemsListProps) => {
  const { items } = order;

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
              item={transformOrderItemToCartItem(item)}
              hideCounter
              hideCustomizations
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

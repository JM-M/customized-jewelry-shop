import { AdminOrderDetails } from "@/modules/admin/orders/types";
import { CartItemCard } from "@/modules/cart/ui/components/cart-item-card";

interface FastProductsReviewProps {
  order: AdminOrderDetails;
}

export const FastProductsReview = ({ order }: FastProductsReviewProps) => {
  // Transform order items to match CartItemCard's expected format
  const cartItems = order.items.map((item) => ({
    product: {
      price: item.unitPrice.toString(),
      primaryImage: item.product?.primaryImage || "",
      name: item.product?.name || "",
    },
    quantity: item.quantity,
    customizations: item.customizations || null,
    material: item.material
      ? {
          name: item.material.name,
          hexColor: item.material.hexColor || "#000000",
        }
      : null,
  }));

  return (
    <div className="space-y-5">
      {cartItems.map((item, index) => (
        <CartItemCard
          key={`${order.items[index]?.id || index}`}
          item={item}
          hideCounter
          hideCustomizations={false}
        />
      ))}
    </div>
  );
};

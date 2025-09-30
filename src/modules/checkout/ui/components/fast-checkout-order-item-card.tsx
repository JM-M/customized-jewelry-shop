import { Card } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { AdminOrderItem } from "@/modules/admin/orders/types";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface FastCheckoutOrderItemCardProps {
  item: AdminOrderItem;
}

export const FastCheckoutOrderItemCard = ({
  item,
}: FastCheckoutOrderItemCardProps) => {
  const { product, quantity, unitPrice } = item;
  const totalPrice = Number(unitPrice) * quantity;

  if (!product) return null;

  return (
    <Card className="flex flex-row items-center justify-between gap-0 p-0 shadow-none">
      <div className="relative aspect-[6/7] h-20">
        <Image
          src={product.primaryImage}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 self-stretch px-3 py-1.5">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">
          {formatNaira(Number(unitPrice))}
        </p>
        {item.material && (
          <p className="text-xs text-gray-400">
            Material: {item.material.name}
          </p>
        )}
        {item.customizations && Object.keys(item.customizations).length > 0 && (
          <div className="mt-1">
            <p className="text-xs text-gray-400">Customizations:</p>
            {Object.entries(item.customizations).map(
              ([optionId, customization]) => (
                <p key={optionId} className="text-xs text-gray-400">
                  • {customization.content}
                </p>
              ),
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <XIcon className="size-3" strokeWidth={1.2} />
            {quantity}
          </div>
          <span className="font-medium text-gray-900">
            {formatNaira(totalPrice)}
          </span>
        </div>
      </div>
    </Card>
  );
};

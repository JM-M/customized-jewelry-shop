import { Card } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { CartItem } from "@/modules/cart/types";
import { AddToBagCounter } from "@/modules/products/ui/components/add-to-bag-counter";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard = ({ item }: CartItemCardProps) => {
  const { product, price, quantity } = item;
  const { name, primaryImage } = product;
  return (
    <Card className="flex flex-row items-center justify-between gap-0 p-0 shadow-none">
      <div className="h-32">
        <Image src={primaryImage} alt={name} height={128} width={128} />
      </div>
      <div className="flex-1 self-stretch px-3 py-2">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">{formatNaira(Number(price))}</p>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <XIcon className="size-3" strokeWidth={1.2} />
          {quantity}
        </div>
        <div className="mt-auto flex items-center justify-end pt-2">
          <AddToBagCounter cartItem={item} />
        </div>
      </div>
    </Card>
  );
};

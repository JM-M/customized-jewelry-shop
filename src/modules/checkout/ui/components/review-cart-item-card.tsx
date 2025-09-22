import { Card } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { CartItem } from "@/modules/cart/types";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface ReviewCartItemCardProps {
  item: CartItem;
}

export const ReviewCartItemCard = ({ item }: ReviewCartItemCardProps) => {
  const { product, price, quantity } = item;
  const { name, primaryImage } = product;
  const totalPrice = Number(price) * quantity;

  return (
    <Card className="flex flex-row items-center justify-between gap-0 p-0 shadow-none">
      <div className="h-20">
        <Image src={primaryImage} alt={name} height={80} width={80} />
      </div>
      <div className="flex-1 self-stretch px-3 py-1.5">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">{formatNaira(Number(price))}</p>
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

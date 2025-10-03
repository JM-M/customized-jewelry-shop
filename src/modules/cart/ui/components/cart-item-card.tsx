import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { CartItem } from "@/modules/cart/types";
import { AddToBagCounter } from "@/modules/products/ui/components/add-to-bag-counter";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard = ({ item }: CartItemCardProps) => {
  const { product, quantity, customizations } = item;
  const price = Number(product.price);
  const totalPrice = price * quantity;
  console.log(customizations);
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3">
        <div className="bg-secondary relative aspect-[6/7] h-[120px] overflow-hidden rounded-lg">
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 self-stretch">
          <h4 className="text-lg font-medium">{product.name}</h4>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>{formatNaira(price)}</span> <XIcon className="size-3" />{" "}
            <span>{quantity}</span>
          </div>
          <div className="font-medium">{formatNaira(totalPrice)}</div>
          <div className="mt-auto flex items-center justify-end">
            <AddToBagCounter
              cartItem={item}
              buttonProps={{ className: "size-8", variant: "secondary" }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <h4 className="text-muted-foreground text-sm font-medium">
          Customizations
        </h4>
      </CardFooter>
    </Card>
  );
};

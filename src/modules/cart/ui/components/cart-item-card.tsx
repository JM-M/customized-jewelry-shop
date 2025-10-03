import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatNaira } from "@/lib/utils";
import { CartItem } from "@/modules/cart/types";
import { AddToBagCounter } from "@/modules/products/ui/components/add-to-bag-counter";
import { ChevronDown, ChevronUp, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CartItemCardProps {
  item: CartItem;
  hideCounter?: boolean;
  hideCustomizations?: boolean;
}

export const CartItemCard = ({
  item,
  hideCounter = false,
  hideCustomizations = false,
}: CartItemCardProps) => {
  const { product, quantity, customizations } = item;
  const price = Number(product.price);
  const totalPrice = price * quantity;
  const [showCustomizations, setShowCustomizations] =
    useState(!hideCustomizations);

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
          {!hideCounter && (
            <div className="mt-auto flex items-center justify-end">
              <AddToBagCounter
                cartItem={item}
                buttonProps={{ className: "size-8", variant: "secondary" }}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <h4 className="text-muted-foreground text-sm font-medium">
              Customizations
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomizations(!showCustomizations)}
              className="h-6 p-0 font-normal"
            >
              {showCustomizations ? (
                <>
                  Hide
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          {showCustomizations && (
            <div className="space-y-4">
              {Object.values(customizations || {}).map((customization, i) => {
                const { name, type, content } = customization;

                return (
                  <div key={i}>
                    <Label className="mb-1 font-medium">
                      {i + 1}. {name}
                    </Label>
                    <div>
                      {type === "image" ? (
                        <Image
                          key={i}
                          src={content}
                          height={100}
                          width={100}
                          className="h-auto rounded-lg"
                          alt={`Customization ${i + 1}`}
                        />
                      ) : (
                        <p className="text-sm">{content}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

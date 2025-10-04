import { GoogleFontLoader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatNaira } from "@/lib/utils";
import { CartItem } from "@/modules/cart/types";
import { Customization } from "@/modules/products/types";
import { AddToBagCounter } from "@/modules/products/ui/components/add-to-bag-counter";
import { capitalize } from "lodash-es";
import { ChevronDown, ChevronUp, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Minimal interface with only the props actually used by the component
interface MinimalCartItem {
  product: {
    price: string;
    primaryImage: string;
    name: string;
  };
  quantity: number;
  customizations?: Record<string | number, Customization> | null;
  material?: {
    name: string;
    hexColor: string;
  } | null;
}

interface CartItemCardProps {
  item: MinimalCartItem | CartItem; // Accept both minimal and full CartItem for backward compatibility
  hideCounter?: boolean;
  hideCustomizations?: boolean;
}

export const CartItemCard = ({
  item,
  hideCounter = false,
  hideCustomizations = false,
}: CartItemCardProps) => {
  const { product, quantity, customizations, material } = item;
  const price = Number(product.price);
  const totalPrice = price * quantity;
  const [showCustomizations, setShowCustomizations] =
    useState(!hideCustomizations);

  const formattedMaterialName = material?.name
    .replaceAll("_", " ")
    .split(" ")
    .map(capitalize)
    .join(" ");

  const customizationsArray = Object.values(customizations || {});
  const hasCustomizations = !!customizationsArray.length;

  // Get unique fonts from customizations
  const fontsUsed = Array.from(
    new Set(
      customizationsArray.filter((c) => c.font?.name).map((c) => c.font!.name),
    ),
  );

  // Check if we have a full CartItem (with id) for counter functionality
  const hasFullCartItem = "id" in item && "cartId" in item;

  return (
    <Card>
      {/* Load fonts used in customizations */}
      {fontsUsed.map((fontName) => (
        <GoogleFontLoader key={fontName} font={fontName} />
      ))}
      <CardContent className="flex items-center justify-between gap-3">
        <div className="bg-secondary relative mb-auto aspect-[6/7] h-[120px] overflow-hidden rounded-lg">
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
          {material && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span
                className="inline-block size-4 rounded-full"
                style={{ backgroundColor: material.hexColor }}
              />
              {formattedMaterialName}
            </div>
          )}
          {!hideCounter && hasFullCartItem && (
            <div className="mt-auto flex items-center justify-end">
              <AddToBagCounter
                cartItem={item as CartItem}
                buttonProps={{ className: "size-8", variant: "secondary" }}
              />
            </div>
          )}
        </div>
      </CardContent>
      {hasCustomizations && (
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
                {customizationsArray.map((customization, i) => {
                  const { name, type, content, font } = customization;

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
                          <div className="space-y-2">
                            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
                              <p
                                className="text-lg font-medium"
                                style={
                                  font ? { fontFamily: font.name } : undefined
                                }
                              >
                                {content}
                              </p>
                            </div>
                            {font && (
                              <div className="text-muted-foreground flex items-center justify-between text-xs">
                                <span>Font: {font.name}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

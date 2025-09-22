"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/modules/cart/contexts";
import { CartItems } from "@/modules/cart/ui/components/cart-items";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const CartSheet = () => {
  const { isOpen, setIsOpen, cartSummary } = useCart();
  const closeCart = () => setIsOpen(false);
  const itemCount = cartSummary.itemCount;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full gap-0 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl font-medium">
            Your Shopping Bag {itemCount && `(${itemCount})`}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-13rem)]">
          <div className="flex-1 p-4">
            <CartItems />
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <SheetFooter>
          <Button className="h-12" onClick={closeCart} asChild>
            <Link href="/checkout">
              Continue to Checkout <ArrowRightIcon />
            </Link>
          </Button>
          <Button variant="outline" className="h-12" onClick={closeCart}>
            Continue Shopping
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/modules/cart/contexts";
import { Button } from "../ui/button";

export const CartSheet = () => {
  const { isOpen, setIsOpen } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl font-medium">
            Your Shopping Bag
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">Content</div>
        <SheetFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Continue Shopping
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

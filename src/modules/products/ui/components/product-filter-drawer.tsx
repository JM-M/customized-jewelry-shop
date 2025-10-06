import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductFilters } from "./product-filters";

interface ProductFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductFilterDrawer = ({
  open,
  onOpenChange,
}: ProductFilterDrawerProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <div className="w-full">
                <DrawerTitle className="text-lg font-medium">
                  Filter Products
                </DrawerTitle>
                <DrawerDescription>
                  Refine your search by price, materials, and more.
                </DrawerDescription>
              </div>
              {/* <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose> */}
            </div>
          </DrawerHeader>

          <ScrollArea className="h-[calc(100vh-22rem)]">
            <ProductFilters
              onApplyFilters={() => onOpenChange(false)}
              onCancel={() => onOpenChange(false)}
            />
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

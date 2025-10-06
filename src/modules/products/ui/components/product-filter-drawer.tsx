import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FilterIcon } from "lucide-react";
import { ProductFilters } from "./product-filters";

export const ProductFilterDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 font-normal">
          <FilterIcon strokeWidth={1.2} className="h-4 w-4" />
          Filter
          <span className="bg-primary text-primary-foreground ml-1 rounded-full px-2 py-0.5 text-xs">
            2
          </span>
        </Button>
      </DrawerTrigger>
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

          <div className="max-h-[calc(100vh-22rem)] overflow-y-auto">
            <ProductFilters />
          </div>

          <DrawerFooter className="pt-4">
            <Button className="w-full">Apply Filters</Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

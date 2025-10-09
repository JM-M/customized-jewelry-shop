"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { DEFAULT_LOW_STOCK_THRESHOLD } from "../../../constants";

interface Material {
  id: string;
  displayName: string;
  hexColor: string;
}

interface MaterialWithPrice {
  materialId: string;
  price: string;
  stockQuantity: string;
  lowStockThreshold: string;
  isDefault: boolean;
}

interface MaterialsPricingFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  materials: Material[];
  selectedMaterials: MaterialWithPrice[];
  onToggleMaterial: (materialId: string) => void;
  onSetDefaultMaterial: (materialId: string) => void;
}

export const MaterialsPricingFields = ({
  form,
  materials,
  selectedMaterials,
  onToggleMaterial,
  onSetDefaultMaterial,
}: MaterialsPricingFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Base Price (₦) <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...field}
                // autoGrow
              />
            </FormControl>
            <FormDescription>
              Default price or fallback if no materials selected
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <label className="text-sm font-medium">
          Available Materials (Optional)
        </label>
        <p className="text-muted-foreground mb-3 text-sm">
          Select materials and set individual prices
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {materials.map((material) => {
            const isSelected = selectedMaterials.some(
              (m) => m.materialId === material.id,
            );

            return (
              <div
                key={material.id}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center gap-2 rounded-md border p-3 text-center text-sm transition-colors hover:bg-gray-50",
                  {
                    "border-primary bg-primary/5": isSelected,
                  },
                )}
                onClick={() => onToggleMaterial(material.id)}
              >
                {isSelected && (
                  <CheckIcon className="text-primary absolute top-2 right-2 size-4" />
                )}
                <span
                  className="block size-6 rounded-full"
                  style={{ backgroundColor: material.hexColor }}
                />
                <span className="text-xs">{material.displayName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {selectedMaterials.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Material Pricing & Inventory
          </label>
          {selectedMaterials.map((selectedMaterial, index) => {
            const material = materials.find(
              (m) => m.id === selectedMaterial.materialId,
            );
            if (!material) return null;

            return (
              <div
                key={selectedMaterial.materialId}
                className="space-y-3 rounded-lg border p-4"
              >
                {/* Header Row: Material Name + Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="block size-6 shrink-0 rounded-full"
                      style={{ backgroundColor: material.hexColor }}
                    />
                    <span className="text-sm font-medium">
                      {material.displayName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={
                        selectedMaterial.isDefault ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        onSetDefaultMaterial(selectedMaterial.materialId)
                      }
                    >
                      {selectedMaterial.isDefault ? "Default" : "Set Default"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        onToggleMaterial(selectedMaterial.materialId)
                      }
                    >
                      <XIcon />
                    </Button>
                  </div>
                </div>

                {/* Input Grid: 3 columns on desktop, stack on mobile */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name={`materials.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Price (₦) <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`materials.${index}.stockQuantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`materials.${index}.lowStockThreshold`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low Stock Alert</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder={DEFAULT_LOW_STOCK_THRESHOLD.toString()}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Alert when stock falls below
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

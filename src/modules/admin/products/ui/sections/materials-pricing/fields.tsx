"use client";

import { CheckIcon } from "lucide-react";
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

interface Material {
  id: string;
  displayName: string;
  hexColor: string;
}

interface MaterialWithPrice {
  materialId: string;
  price: string;
  stockQuantity: string;
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
          <label className="text-sm font-medium">Material Pricing</label>
          {selectedMaterials.map((selectedMaterial, index) => {
            const material = materials.find(
              (m) => m.id === selectedMaterial.materialId,
            );
            if (!material) return null;

            return (
              <div
                key={selectedMaterial.materialId}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
              >
                <div className="flex flex-1 items-center gap-3">
                  <span
                    className="block size-6 shrink-0 rounded-full"
                    style={{ backgroundColor: material.hexColor }}
                  />
                  <span className="text-sm font-medium">
                    {material.displayName}
                  </span>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`materials.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="w-fit sm:w-32">
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Price"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`materials.${index}.stockQuantity`}
                    render={({ field }) => (
                      <FormItem className="w-fit sm:w-24">
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Stock"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant={selectedMaterial.isDefault ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      onSetDefaultMaterial(selectedMaterial.materialId)
                    }
                  >
                    {selectedMaterial.isDefault ? "Default" : "Set Default"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

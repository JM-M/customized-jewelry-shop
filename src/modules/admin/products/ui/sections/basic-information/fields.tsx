"use client";

import { UseFormReturn } from "react-hook-form";

import { Combobox, ComboboxOption } from "@/components/shared/combobox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInformationFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  categories: ComboboxOption[];
}

export const BasicInformationFields = ({
  form,
  categories,
}: BasicInformationFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Product Name <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g., Diamond Necklace" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Category <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Combobox
                options={categories}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                emptyText="No category found."
                classNames={{
                  base: "w-full",
                  popoverContent: "w-full",
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your product..."
                className="min-h-32"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DN-001" {...field} />
              </FormControl>
              <FormDescription>Stock Keeping Unit (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stockQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Stock Quantity</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormDescription>
                Used if not using materials system
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

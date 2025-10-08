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

interface ShippingFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  packagingOptions: ComboboxOption[];
}

export const ShippingFields = ({
  form,
  packagingOptions,
}: ShippingFieldsProps) => {
  return (
    <FormField
      control={form.control}
      name="packagingId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Packaging</FormLabel>
          <FormControl>
            <Combobox
              options={packagingOptions}
              value={field.value || ""}
              onValueChange={field.onChange}
              placeholder="Select packaging type"
              searchPlaceholder="Search packaging..."
              emptyText="No packaging found."
              className="w-full"
            />
          </FormControl>
          <FormDescription>
            Select the packaging type for this product
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

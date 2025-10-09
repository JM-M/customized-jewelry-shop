"use client";

import { UseFormReturn } from "react-hook-form";

import { Combobox, ComboboxOption } from "@/components/shared/combobox";
import {
  FormControl,
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
    </div>
  );
};

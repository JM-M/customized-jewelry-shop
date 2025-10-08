"use client";

import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SeoMetadataFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export const SeoMetadataFields = ({ form }: SeoMetadataFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="metaTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Title</FormLabel>
            <FormControl>
              <Input placeholder="SEO-friendly title..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description for search results..."
                className="min-h-24"
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

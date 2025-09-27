"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminProduct } from "../../contexts/admin-product";

const customizationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["text", "image", "qr_code"]),
  sampleImage: z.string().optional(),
  maxCharacters: z.number().min(1).optional(),
});

type CustomizationFormData = z.infer<typeof customizationFormSchema>;

export const AddCustomizationForm = () => {
  const { product } = useAdminProduct();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomizationFormData>({
    resolver: zodResolver(customizationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "text",
      sampleImage: "",
      maxCharacters: undefined,
    },
  });

  const { mutate: createCustomizationOption } = useMutation(
    trpc.admin.products.createCustomizationOption.mutationOptions(),
  );

  const onSubmit = (data: CustomizationFormData) => {
    if (!product) return;

    setIsSubmitting(true);
    createCustomizationOption(
      {
        productId: product.id,
        ...data,
      },
      {
        onSuccess: () => {
          form.reset();
          queryClient.invalidateQueries({
            queryKey: trpc.admin.products.getCustomizationOptions.queryKey({
              productId: product.id,
            }),
          });
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  const handleCancel = () => {
    form.reset();
  };

  if (!product) {
    return null;
  }

  return (
    <Card className="gap-2 p-2">
      <CardHeader className="p-0">
        <CardTitle className="font-medium">Add New Option</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter customization option name"
                      {...field}
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description for this customization option"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="qr_code">QR Code</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxCharacters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Characters (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Maximum characters allowed"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseInt(value, 10) : undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sampleImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter sample image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Option"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

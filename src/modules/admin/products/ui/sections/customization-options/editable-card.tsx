"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { EditIcon, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useTRPC } from "@/trpc/client";

import { useAdminProduct } from "../../../contexts/admin-product";
import { CustomizationOptionsFields } from "./fields";
import { CustomizationOptionsView } from "./view";

const customizationOptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  type: z.enum(["text", "image", "qr_code"]),
  maxCharacters: z.string().optional(),
  sampleImage: z.string().optional(),
});

const customizationOptionsFormSchema = z.object({
  customizationOptions: z.array(customizationOptionSchema),
});

type CustomizationOptionsFormValues = z.infer<
  typeof customizationOptionsFormSchema
>;

export const CustomizationOptionsCard = () => {
  const { product, refetchProduct, setProductData } = useAdminProduct();
  const [isEditing, setIsEditing] = useState(false);
  const trpc = useTRPC();

  const form = useForm<CustomizationOptionsFormValues>({
    resolver: zodResolver(customizationOptionsFormSchema),
    defaultValues: {
      customizationOptions:
        product.customizationOptions?.map((opt) => ({
          name: opt.name,
          description: opt.description || "",
          type: opt.type as "text" | "image" | "qr_code",
          maxCharacters: opt.maxCharacters?.toString(),
          sampleImage: opt.sampleImage || undefined,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customizationOptions",
  });

  const { mutate: updateOptionsMutation, isPending } = useMutation(
    trpc.admin.products.updateProduct.mutationOptions(),
  );

  const updateOptions = (
    values: Parameters<typeof updateOptionsMutation>[0],
  ) => {
    // Optimistically update the product data
    const updatedOptions = values.customizationOptions?.map((opt, index) => ({
      id: `temp-${index}`,
      productId: product.id,
      name: opt.name,
      description: opt.description || null,
      type: opt.type,
      maxCharacters: opt.maxCharacters ? parseInt(opt.maxCharacters) : null,
      sampleImage: opt.sampleImage || null,
      displayOrder: index,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setProductData({
      customizationOptions: updatedOptions || [],
    });
    setIsEditing(false);

    updateOptionsMutation(values, {
      onSuccess: () => {
        toast.success("Customization options updated successfully!");
        refetchProduct();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update options");
        setIsEditing(true);
      },
    });
  };

  const onSubmit = (values: CustomizationOptionsFormValues) => {
    updateOptions({
      productId: product.id,
      customizationOptions: values.customizationOptions,
    });
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const addOption = () => {
    append({
      name: "",
      description: "",
      type: "text",
      maxCharacters: "50",
    });
  };

  const removeOption = (index: number) => {
    remove(index);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="font-medium">Customization Options</CardTitle>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <EditIcon />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CustomizationOptionsFields
                form={form}
                fieldCount={fields.length}
                onAddOption={addOption}
                onRemoveOption={removeOption}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  <XIcon />
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Spinner />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <CustomizationOptionsView options={product.customizationOptions} />
        )}
      </CardContent>
    </Card>
  );
};

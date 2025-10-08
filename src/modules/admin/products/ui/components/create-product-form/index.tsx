"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormMessage } from "@/components/ui/form";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreateProductFormValues, createProductSchema } from "../../../schemas";
import { BasicInformationFields } from "../../sections/basic-information";
import { CustomizationOptionsFields } from "../../sections/customization-options";
import { MaterialsPricingFields } from "../../sections/materials-pricing";
import { ProductImagesFields } from "../../sections/product-images";
import { SeoMetadataFields } from "../../sections/seo-metadata";
import { ShippingFields } from "../../sections/shipping";

const mockMaterials = [
  { id: "1", displayName: "14K Gold", hexColor: "#FFD700" },
  { id: "2", displayName: "Sterling Silver", hexColor: "#C0C0C0" },
  { id: "3", displayName: "Rose Gold", hexColor: "#B76E79" },
  { id: "4", displayName: "White Gold", hexColor: "#E5E4E2" },
  { id: "5", displayName: "Platinum", hexColor: "#E5E4E2" },
  { id: "6", displayName: "Bronze", hexColor: "#CD7F32" },
];

const mockPackaging = [
  { value: "pkg_1", label: "Standard Box" },
  { value: "pkg_2", label: "Premium Box" },
  { value: "pkg_3", label: "Luxury Gift Box" },
];

export const CreateProductForm = () => {
  const trpc = useTRPC();
  const { data: allCategories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );

  // Transform categories to only show children with parent context, sorted by parent then child
  const categoryOptions = useMemo(() => {
    if (!allCategories) return [];

    // Filter to only child categories (those with parentId)
    const childCategories = allCategories.filter(
      (cat) => cat.parentId !== null,
    );

    // Sort by parent name, then child name
    const sortedChildren = childCategories.sort((a, b) => {
      const parentA = allCategories.find((p) => p.id === a.parentId);
      const parentB = allCategories.find((p) => p.id === b.parentId);

      const parentComparison = (parentA?.name || "").localeCompare(
        parentB?.name || "",
      );
      if (parentComparison !== 0) return parentComparison;

      return a.name.localeCompare(b.name);
    });

    // Map to combobox format with parent name included
    return sortedChildren.map((child) => {
      const parent = allCategories.find((p) => p.id === child.parentId);

      return {
        value: child.id,
        label: parent ? `${parent.name} > ${child.name}` : child.name,
      };
    });
  }, [allCategories]);

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      sku: "",
      price: "",
      stockQuantity: "0",
      packagingId: "",
      metaTitle: "",
      metaDescription: "",
      images: [],
      materials: [],
      customizationOptions: [],
    },
  });

  console.log(form.formState.errors);

  // Field arrays for dynamic fields
  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
    update: updateMaterial,
  } = useFieldArray({
    control: form.control,
    name: "materials",
  });

  const {
    fields: customizationFields,
    append: appendCustomization,
    remove: removeCustomization,
  } = useFieldArray({
    control: form.control,
    name: "customizationOptions",
  });

  const onSubmit = (values: CreateProductFormValues) => {
    // Generate slug from name
    const slug = generateSlug(values.name);

    console.log("Form values:", { ...values, slug });
    // TODO: Implement API call
  };

  const toggleMaterial = (materialId: string) => {
    const existingIndex = materialFields.findIndex(
      (m) => m.materialId === materialId,
    );

    if (existingIndex > -1) {
      removeMaterial(existingIndex);
    } else {
      appendMaterial({
        materialId,
        price: "",
        stockQuantity: "0",
        isDefault: materialFields.length === 0, // First material is default
      });
    }
  };

  const setDefaultMaterial = (materialId: string) => {
    materialFields.forEach((material, index) => {
      updateMaterial(index, {
        ...material,
        isDefault: material.materialId === materialId,
      });
    });
  };

  const addCustomizationOption = () => {
    appendCustomization({
      name: "",
      description: "",
      type: "text",
      maxCharacters: "50",
    });
  };

  const removeCustomizationOption = (index: number) => {
    removeCustomization(index);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleImagesChange = (images: string[]) => {
    form.setValue("images", images, { shouldValidate: true });
  };

  // Get current form values for rendering
  const images = form.watch("images") as string[];
  const selectedMaterials = materialFields;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about your product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BasicInformationFields form={form} categories={categoryOptions} />
          </CardContent>
        </Card>

        {/* Materials & Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Materials & Pricing</CardTitle>
            <CardDescription>
              Select available materials and set prices for each
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MaterialsPricingFields
              form={form}
              materials={mockMaterials}
              selectedMaterials={selectedMaterials}
              onToggleMaterial={toggleMaterial}
              onSetDefaultMaterial={setDefaultMaterial}
            />
            {form.formState.errors.materials && (
              <FormMessage className="mt-2">
                {form.formState.errors.materials.message}
              </FormMessage>
            )}
          </CardContent>
        </Card>

        {/* Images Section */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Upload product images (primary image is required)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductImagesFields
              images={images}
              onImagesChange={handleImagesChange}
            />
            {form.formState.errors.images && (
              <FormMessage>{form.formState.errors.images.message}</FormMessage>
            )}
          </CardContent>
        </Card>

        {/* Customization Options Section */}
        <Card>
          <CardHeader>
            <CardTitle>Customization Options</CardTitle>
            <CardDescription>
              Add customization options like engraving, custom text, etc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomizationOptionsFields
              form={form}
              fieldCount={customizationFields.length}
              onAddOption={addCustomizationOption}
              onRemoveOption={removeCustomizationOption}
            />
          </CardContent>
        </Card>

        {/* Shipping Section */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
            <CardDescription>Configure shipping options</CardDescription>
          </CardHeader>
          <CardContent>
            <ShippingFields form={form} packagingOptions={mockPackaging} />
          </CardContent>
        </Card>

        {/* SEO & Metadata Section */}
        <Card>
          <CardHeader>
            <CardTitle>SEO & Metadata</CardTitle>
            <CardDescription>
              Optimize your product for search engines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SeoMetadataFields form={form} />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            <SaveIcon className="mr-2 h-4 w-4" />
            Create Product
          </Button>
        </div>
      </form>
    </Form>
  );
};

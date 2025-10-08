"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormMessage } from "@/components/ui/form";

import { Spinner } from "@/components/shared/spinner";
import { useTRPC } from "@/trpc/client";
import { CreateProductFormValues, createProductSchema } from "../../../schemas";
import { BasicInformationFields } from "../../sections/basic-information";
import { CustomizationOptionsFields } from "../../sections/customization-options";
import { MaterialsPricingFields } from "../../sections/materials-pricing";
import { ProductImagesFields } from "../../sections/product-images";
import { SeoMetadataFields } from "../../sections/seo-metadata";
import { ShippingFields } from "../../sections/shipping";

const mockPackaging = [
  { value: "pkg_1", label: "Standard Box" },
  { value: "pkg_2", label: "Premium Box" },
  { value: "pkg_3", label: "Luxury Gift Box" },
];

export const CreateProductForm = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: allCategories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions(),
  );
  const { data: allMaterials } = useSuspenseQuery(
    trpc.admin.products.getAllMaterials.queryOptions(),
  );

  // Create product mutation
  const {
    mutate: createProduct,
    isPending,
    error: mutationError,
  } = useMutation(trpc.admin.products.createProduct.mutationOptions());

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

    createProduct(
      {
        name: values.name,
        slug,
        description: values.description,
        categoryId: values.categoryId,
        sku: values.sku,
        price: values.price,
        stockQuantity: values.stockQuantity,
        packagingId: values.packagingId,
        images: values.images,
        materials: values.materials,
        customizationOptions: values.customizationOptions,
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
      },
      {
        onSuccess: (data) => {
          toast.success(`Product "${data.product.name}" created successfully!`);
          form.reset();
          // Navigate to the product details or products list page
          router.push(`/admin/products`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create product");
        },
      },
    );
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
              materials={allMaterials}
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

        {/* Error display */}
        {mutationError && (
          <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
            {mutationError.message ||
              "Failed to create product. Please try again."}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner />
                Creating...
              </>
            ) : (
              <>
                <SaveIcon />
                Create Product
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

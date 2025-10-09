import { z } from "zod";

// Section Schemas - Each corresponds to an editable card section

export const basicInformationSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

export const materialsPricingSchema = z.object({
  price: z.string().min(1, "Price is required"),
});

export const shippingSchema = z.object({
  packagingId: z.string().optional(),
});

export const seoMetadataSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Schema for dynamic fields in create form
export const materialWithPriceSchema = z.object({
  materialId: z.string(),
  price: z.string().min(1, "Price is required"),
  stockQuantity: z.string(),
  lowStockThreshold: z.string(),
  isDefault: z.boolean(),
});

export const customizationOptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  type: z.enum(["text", "image", "qr_code"]),
  maxCharacters: z.string().optional(),
  sampleImage: z.string().optional(),
});

// Composed Schema for Create Product Form
export const createProductSchema = basicInformationSchema
  .merge(materialsPricingSchema)
  .merge(shippingSchema)
  .merge(seoMetadataSchema)
  .extend({
    // Images
    images: z
      .array(z.string())
      .min(1, "At least one image is required")
      .max(9, "Maximum 9 images allowed"),
    // Materials
    materials: z
      .array(materialWithPriceSchema)
      .optional()
      .refine(
        (materials) => {
          if (!materials || materials.length === 0) return true;
          const defaultCount = materials.filter((m) => m.isDefault).length;
          return defaultCount <= 1;
        },
        { message: "Only one material can be set as default" },
      ),
    // Customization Options
    customizationOptions: z.array(customizationOptionSchema).optional(),
  });

// Type Exports
export type BasicInformationFormValues = z.infer<typeof basicInformationSchema>;
export type MaterialsPricingFormValues = z.infer<typeof materialsPricingSchema>;
export type ShippingFormValues = z.infer<typeof shippingSchema>;
export type SeoMetadataFormValues = z.infer<typeof seoMetadataSchema>;
export type MaterialWithPrice = z.infer<typeof materialWithPriceSchema>;
export type CustomizationOption = z.infer<typeof customizationOptionSchema>;
export type CreateProductFormValues = z.infer<typeof createProductSchema>;

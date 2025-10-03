import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GetProductByIdOutput =
  inferRouterOutputs<AppRouter>["products"]["getById"];

export type GetProductsByCategorySlugOutput =
  inferRouterOutputs<AppRouter>["products"]["getManyByCategorySlug"];

export type GetNewArrivalsOutput =
  inferRouterOutputs<AppRouter>["products"]["getNewArrivals"];

export type GetProductMaterialsOutput =
  inferRouterOutputs<AppRouter>["products"]["getProductMaterials"];

export type GetProductCustomizationOptionsOutput =
  inferRouterOutputs<AppRouter>["products"]["getProductCustomizationOptions"];

// Customization types - updated to match new schema
export type CustomizationType = "text" | "image" | "qr_code";

export interface CustomizationContent {
  id: string;
  type: CustomizationType;
  textContent?: string;
  imageFile?: File | null;
  imageUrl?: string;
  imageFilename?: string;
  imageSizeBytes?: number;
  qrData?: string;
  qrSize?: number;
  qrErrorCorrection?: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  description: string | null;
  type: CustomizationType;
  sampleImage: string | null;
  maxCharacters: number | null;
  displayOrder: number | null;
  isActive: boolean;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

// Legacy types for backward compatibility during migration
// These will be removed once migration is complete
export type EngravingType = CustomizationType;
export type EngravingContent = CustomizationContent;
export type GetEngravingAreasByProductIdOutput =
  GetProductCustomizationOptionsOutput;

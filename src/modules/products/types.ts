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

// Customization types
export type CustomizationType = "text" | "image" | "qr_code";

export interface CustomizationContent {
  id: string;
  type: CustomizationType;
  textContent?: string;
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

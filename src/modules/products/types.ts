import { ENGRAVING_TYPES } from "@/constants/db";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GetProductByIdOutput =
  inferRouterOutputs<AppRouter>["products"]["getById"];

export type GetProductsByCategorySlugOutput =
  inferRouterOutputs<AppRouter>["products"]["getManyByCategorySlug"];

export type GetNewArrivalsOutput =
  inferRouterOutputs<AppRouter>["products"]["getNewArrivals"];

export type GetMaterialsByProductIdOutput =
  inferRouterOutputs<AppRouter>["products"]["getProductMaterialsByProductId"];

export type GetEngravingAreasByProductIdOutput =
  inferRouterOutputs<AppRouter>["products"]["getProductEngravingAreasByProductId"];

// New engraving types
export type EngravingType = (typeof ENGRAVING_TYPES)[number];

export interface EngravingContent {
  id: string;
  type: EngravingType;
  textContent?: string;
  imageUrl?: string;
  imageFilename?: string;
  imageSizeBytes?: number;
  qrData?: string;
  qrSize?: number;
  qrErrorCorrection?: string;
}

export interface EnhancedEngravingArea {
  id: string;
  name: string;
  description?: string;
  engravingType: EngravingType;
  maxCharacters?: number;
  referenceImage?: string;
}

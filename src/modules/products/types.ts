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

// Use inferred types from cart procedures for customizations
export type CartCustomization = {
  name: string;
  type: "text" | "image" | "qr_code";
  content: string;
  additionalPrice?: number;
};

// Type for customization state in product context
export type CustomizationState = Record<string, CartCustomization>;

// Re-export cart types for convenience
export type GetCartOutput = inferRouterOutputs<AppRouter>["cart"]["getCart"];
export type CartItem = NonNullable<GetCartOutput>["items"][number];

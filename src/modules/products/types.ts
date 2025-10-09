import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GetProductByIdOutput =
  inferRouterOutputs<AppRouter>["products"]["getById"];

export type GetProductBySlugOutput =
  inferRouterOutputs<AppRouter>["products"]["getBySlug"];

export type GetProductsByCategorySlugOutput =
  inferRouterOutputs<AppRouter>["products"]["getManyByCategorySlug"];

export type GetNewArrivalsOutput =
  inferRouterOutputs<AppRouter>["products"]["getNewArrivals"];

export type GetProductMaterialsOutput =
  inferRouterOutputs<AppRouter>["products"]["getProductMaterials"];

export type GetProductCustomizationOptionsOutput =
  inferRouterOutputs<AppRouter>["products"]["getProductCustomizationOptions"];

export type GetCartOutput = inferRouterOutputs<AppRouter>["cart"]["getCart"];

export type CartItem = NonNullable<GetCartOutput>["items"][number];

export type GetProductReviewsOutput =
  inferRouterOutputs<AppRouter>["products"]["getProductReviews"];

export type GetProductReviewStatsOutput =
  inferRouterOutputs<AppRouter>["products"]["getProductReviewStats"];

export type GetUserProductReviewStatusOutput =
  inferRouterOutputs<AppRouter>["products"]["getUserProductReviewStatus"];

export type GetProductFilterOptionsOutput =
  inferRouterOutputs<AppRouter>["products"]["getFilterOptions"];

// Single source of truth for customization types
export type CustomizationType = "text" | "image" | "qr_code";

export type CustomizationFont = {
  name: string; // e.g., "Pacifico"
  id: string; // e.g., "pacifico"
};

export type Customization = {
  name: string;
  type: CustomizationType;
  content: string;
  font?: CustomizationFont;
  additionalPrice?: number;
};

// Type for customization state in product context
export type CustomizationState = Record<string, Customization>;

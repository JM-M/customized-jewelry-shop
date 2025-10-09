import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { CUSTOMIZATION_OPTIONS } from "./constants";

export type AdminGetProductsOutput =
  inferRouterOutputs<AppRouter>["admin"]["products"]["getProducts"];

export type GetAllMaterialsOutput =
  inferRouterOutputs<AppRouter>["admin"]["products"]["getAllMaterials"];

export type GetProductForEditOutput =
  inferRouterOutputs<AppRouter>["admin"]["products"]["getProductForEdit"];

export type UpdateProductInput =
  inferRouterInputs<AppRouter>["admin"]["products"]["updateProduct"];

export type UpdateProductOutput =
  inferRouterOutputs<AppRouter>["admin"]["products"]["updateProduct"];

export type ProductCustomizationOptionType =
  (typeof CUSTOMIZATION_OPTIONS)[number];

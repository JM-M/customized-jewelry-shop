import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { CUSTOMIZATION_OPTIONS } from "./constants";

export type AdminGetProductsOutput =
  inferRouterOutputs<AppRouter>["admin"]["products"]["getProducts"];

export type GetAllMaterialsOutput =
  inferRouterOutputs<AppRouter>["admin"]["products"]["getAllMaterials"];

export type ProductCustomizationOptionType =
  (typeof CUSTOMIZATION_OPTIONS)[number];

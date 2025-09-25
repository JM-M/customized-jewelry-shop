import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { CUSTOMIZATION_OPTIONS } from "./constants";

export type AdminGetProductsOutput =
  inferRouterOutputs<AppRouter>["adminProducts"]["getProducts"];

export type GetAllMaterialsOutput =
  inferRouterOutputs<AppRouter>["adminProducts"]["getAllMaterials"];

export type ProductCustomizationOptionType =
  (typeof CUSTOMIZATION_OPTIONS)[number];

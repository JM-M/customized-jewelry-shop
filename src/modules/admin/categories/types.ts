import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GetCategoryWithSubcategoriesOutput =
  inferRouterOutputs<AppRouter>["admin"]["categories"]["getCategoryWithSubcategories"];

import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GetAllCategoriesOutput =
  inferRouterOutputs<AppRouter>["categories"]["getAll"];

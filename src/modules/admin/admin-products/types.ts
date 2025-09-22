import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type AdminGetProductsOutput =
  inferRouterOutputs<AppRouter>["adminProducts"]["getProducts"];

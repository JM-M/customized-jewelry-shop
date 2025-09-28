import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type AdminGetOrdersOutput =
  inferRouterOutputs<AppRouter>["admin"]["orders"]["getOrders"];

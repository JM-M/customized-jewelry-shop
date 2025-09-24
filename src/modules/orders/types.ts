import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GetUserOrdersOutput =
  inferRouterOutputs<AppRouter>["orders"]["getUserOrders"];

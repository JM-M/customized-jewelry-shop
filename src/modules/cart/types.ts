import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type GetCartOutput = inferRouterOutputs<AppRouter>["cart"]["getCart"];
export type CartItem = NonNullable<GetCartOutput>["items"][number];

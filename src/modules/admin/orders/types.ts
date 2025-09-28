import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type AdminGetOrdersOutput =
  inferRouterOutputs<AppRouter>["admin"]["orders"]["getOrders"];

export type AdminGetOrderOutput =
  inferRouterOutputs<AppRouter>["admin"]["orders"]["getOrder"];

// Type for the order details with all related data
export type AdminOrderDetails = NonNullable<AdminGetOrderOutput>;

// Type for order items with product and material details
export type AdminOrderItem = AdminOrderDetails["items"][0];

// Type for customer information
export type AdminOrderCustomer = AdminOrderDetails["customer"];

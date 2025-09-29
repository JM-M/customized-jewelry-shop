import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type AdminGetTransactionsOutput =
  inferRouterOutputs<AppRouter>["admin"]["transactions"]["getTransactions"];

export type AdminGetTransactionOutput =
  inferRouterOutputs<AppRouter>["admin"]["transactions"]["getTransaction"];

// Type for the transaction details with all related data
export type AdminTransactionDetails = NonNullable<AdminGetTransactionOutput>;

// Type for transaction items
export type AdminTransactionItem = AdminGetTransactionsOutput["items"][0];

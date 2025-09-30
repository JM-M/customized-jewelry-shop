import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { orders } from "@/db/schema/orders";
import { transactions } from "@/db/schema/payments";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { CursorPaginatedResponse } from "@/types/api";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const adminTransactionsRouter = createTRPCRouter({
  // Get all transactions for admin
  getTransactions: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(0),
        limit: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE),
        status: z
          .enum([
            "pending",
            "success",
            "failed",
            "cancelled",
            "refunded",
            "partially_refunded",
          ])
          .optional(),
        channel: z
          .enum(["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"])
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const whereConditions = [];
      if (input.status) {
        whereConditions.push(eq(transactions.status, input.status));
      }
      if (input.channel) {
        whereConditions.push(eq(transactions.channel, input.channel));
      }

      // Get total count for pagination
      const [{ count: totalCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(transactions)
        .where(
          whereConditions.length > 0 ? and(...whereConditions) : undefined,
        );

      // Get transactions with cursor-based pagination and order details
      const adminTransactions = await db
        .select({
          id: transactions.id,
          paystackTransactionId: transactions.paystackTransactionId,
          paymentReference: transactions.paymentReference,
          amount: transactions.amount,
          amountInKobo: transactions.amountInKobo,
          currency: transactions.currency,
          status: transactions.status,
          channel: transactions.channel,
          cardType: transactions.cardType,
          bank: transactions.bank,
          last4: transactions.last4,
          fees: transactions.fees,
          customerEmail: transactions.customerEmail,
          customerPhone: transactions.customerPhone,
          customerName: transactions.customerName,
          message: transactions.message,
          createdAt: transactions.createdAt,
          updatedAt: transactions.updatedAt,
          paidAt: transactions.paidAt,
          failedAt: transactions.failedAt,
          refundedAt: transactions.refundedAt,
          // Order details
          orderNumber: orders.orderNumber,
          orderStatus: orders.status,
          // User details
          userName: user.name,
          userEmail: user.email,
        })
        .from(transactions)
        .leftJoin(orders, eq(transactions.orderId, orders.id))
        .leftJoin(user, eq(orders.userId, user.id))
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(desc(transactions.createdAt))
        .offset(input.cursor)
        .limit(input.limit + 1);

      // Check if there are more items
      const hasMore = adminTransactions.length > input.limit;
      const items = hasMore
        ? adminTransactions.slice(0, -1)
        : adminTransactions;

      const response: CursorPaginatedResponse<(typeof items)[0]> = {
        items,
        nextCursor: hasMore ? input.cursor + input.limit : undefined,
        totalCount,
      };

      return response;
    }),

  // Get single transaction by ID
  getTransaction: protectedProcedure
    .input(
      z.object({
        transactionId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      // Get transaction with order and user details
      const [transaction] = await db
        .select({
          id: transactions.id,
          paystackTransactionId: transactions.paystackTransactionId,
          paymentReference: transactions.paymentReference,
          amount: transactions.amount,
          amountInKobo: transactions.amountInKobo,
          currency: transactions.currency,
          status: transactions.status,
          channel: transactions.channel,
          cardType: transactions.cardType,
          bank: transactions.bank,
          last4: transactions.last4,
          fees: transactions.fees,
          feesBreakdown: transactions.feesBreakdown,
          customerEmail: transactions.customerEmail,
          customerPhone: transactions.customerPhone,
          customerName: transactions.customerName,
          gatewayResponse: transactions.gatewayResponse,
          message: transactions.message,
          metadata: transactions.metadata,
          ipAddress: transactions.ipAddress,
          userAgent: transactions.userAgent,
          createdAt: transactions.createdAt,
          updatedAt: transactions.updatedAt,
          paidAt: transactions.paidAt,
          failedAt: transactions.failedAt,
          refundedAt: transactions.refundedAt,
          // Order details
          order: {
            id: orders.id,
            orderNumber: orders.orderNumber,
            status: orders.status,
            subtotal: orders.subtotal,
            deliveryFee: orders.deliveryFee,
            totalAmount: orders.totalAmount,
            trackingNumber: orders.trackingNumber,
            createdAt: orders.createdAt,
          },
          // User details
          customer: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        })
        .from(transactions)
        .leftJoin(orders, eq(transactions.orderId, orders.id))
        .leftJoin(user, eq(orders.userId, user.id))
        .where(eq(transactions.id, input.transactionId))
        .limit(1);

      return transaction || null;
    }),

  // Get single transaction by payment reference
  getTransactionByPaymentReference: protectedProcedure
    .input(
      z.object({
        paymentReference: z.string(),
      }),
    )
    .query(async ({ input }) => {
      // Get transaction with order and user details
      const [transaction] = await db
        .select({
          id: transactions.id,
          paystackTransactionId: transactions.paystackTransactionId,
          paymentReference: transactions.paymentReference,
          amount: transactions.amount,
          amountInKobo: transactions.amountInKobo,
          currency: transactions.currency,
          status: transactions.status,
          channel: transactions.channel,
          cardType: transactions.cardType,
          bank: transactions.bank,
          last4: transactions.last4,
          fees: transactions.fees,
          feesBreakdown: transactions.feesBreakdown,
          customerEmail: transactions.customerEmail,
          customerPhone: transactions.customerPhone,
          customerName: transactions.customerName,
          gatewayResponse: transactions.gatewayResponse,
          message: transactions.message,
          metadata: transactions.metadata,
          ipAddress: transactions.ipAddress,
          userAgent: transactions.userAgent,
          createdAt: transactions.createdAt,
          updatedAt: transactions.updatedAt,
          paidAt: transactions.paidAt,
          failedAt: transactions.failedAt,
          refundedAt: transactions.refundedAt,
          // Order details
          order: {
            id: orders.id,
            orderNumber: orders.orderNumber,
            status: orders.status,
            subtotal: orders.subtotal,
            deliveryFee: orders.deliveryFee,
            totalAmount: orders.totalAmount,
            trackingNumber: orders.trackingNumber,
            createdAt: orders.createdAt,
          },
          // User details
          customer: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        })
        .from(transactions)
        .leftJoin(orders, eq(transactions.orderId, orders.id))
        .leftJoin(user, eq(orders.userId, user.id))
        .where(eq(transactions.paymentReference, input.paymentReference))
        .limit(1);

      return transaction || null;
    }),
});

import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { pickupAddresses, terminalAddresses } from "@/db/schema/logistics";
import { orderItems, orders } from "@/db/schema/orders";
import { materials, products } from "@/db/schema/shop";
import { makeTerminalRequest, terminalClient } from "@/lib/terminal-client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { CursorPaginatedResponse } from "@/types/api";
import { and, count, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod";
import { TerminalGetRateResponse } from "../../../terminal/types";

export const adminOrdersRouter = createTRPCRouter({
  // Get all orders for admin
  getOrders: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(0),
        limit: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE),
        status: z
          .enum([
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "refunded",
          ])
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const whereConditions = [];
      if (input.status) {
        whereConditions.push(eq(orders.status, input.status));
      }

      // Get total count for pagination
      const [{ count: totalCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(orders)
        .where(
          whereConditions.length > 0 ? and(...whereConditions) : undefined,
        );

      // Get orders with cursor-based pagination and user details
      const adminOrders = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          status: orders.status,
          subtotal: orders.subtotal,
          deliveryFee: orders.deliveryFee,
          totalAmount: orders.totalAmount,
          paymentReference: orders.paymentReference,
          trackingNumber: orders.trackingNumber,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt,
          shippedAt: orders.shippedAt,
          deliveredAt: orders.deliveredAt,
          // User details
          userName: user.name,
          userEmail: user.email,
          // Item count
          itemCount: count(orderItems.id).as("itemCount"),
        })
        .from(orders)
        .leftJoin(user, eq(orders.userId, user.id))
        .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .groupBy(
          orders.id,
          orders.orderNumber,
          orders.status,
          orders.subtotal,
          orders.deliveryFee,
          orders.totalAmount,
          orders.paymentReference,
          orders.trackingNumber,
          orders.createdAt,
          orders.updatedAt,
          orders.shippedAt,
          orders.deliveredAt,
          user.name,
          user.email,
        )
        .orderBy(desc(orders.createdAt))
        .offset(input.cursor)
        .limit(input.limit + 1);

      // Check if there are more items
      const hasMore = adminOrders.length > input.limit;
      const items = hasMore ? adminOrders.slice(0, -1) : adminOrders;

      const response: CursorPaginatedResponse<(typeof items)[0]> = {
        items,
        nextCursor: hasMore ? input.cursor + input.limit : undefined,
        totalCount,
      };

      return response;
    }),

  // Get single order by order number
  getOrder: protectedProcedure
    .input(
      z.object({
        orderNumber: z.string(),
      }),
    )
    .query(async ({ input }) => {
      // Get order with user details
      const [order] = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          status: orders.status,
          subtotal: orders.subtotal,
          deliveryFee: orders.deliveryFee,
          totalAmount: orders.totalAmount,
          paymentReference: orders.paymentReference,
          trackingNumber: orders.trackingNumber,
          shipmentId: orders.shipmentId,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt,
          shippedAt: orders.shippedAt,
          deliveredAt: orders.deliveredAt,
          deliveryAddressId: orders.deliveryAddressId,
          pickupAddressId: orders.pickupAddressId,
          rateId: orders.rateId,
          // User details
          customer: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        })
        .from(orders)
        .leftJoin(user, eq(orders.userId, user.id))
        .where(eq(orders.orderNumber, input.orderNumber))
        .limit(1);

      if (!order) {
        return null;
      }

      // Get order items with product and material details
      const orderItemsData = await db
        .select({
          id: orderItems.id,
          productId: orderItems.productId,
          materialId: orderItems.materialId,
          quantity: orderItems.quantity,
          unitPrice: orderItems.unitPrice,
          totalPrice: orderItems.totalPrice,
          customizations: orderItems.customizations,
          notes: orderItems.notes,
          // Product details
          product: {
            id: products.id,
            name: products.name,
            slug: products.slug,
            sku: products.sku,
            primaryImage: products.primaryImage,
          },
          // Material details
          material: {
            id: materials.id,
            name: materials.name,
            displayName: materials.displayName,
            hexColor: materials.hexColor,
          },
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .leftJoin(materials, eq(orderItems.materialId, materials.id))
        .where(eq(orderItems.orderId, order.id));

      return {
        ...order,
        items: orderItemsData,
      };
    }),

  // Get delivery address for an order
  getDeliveryAddress: protectedProcedure
    .input(
      z.object({
        addressId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const [address] = await db
        .select()
        .from(terminalAddresses)
        .where(eq(terminalAddresses.address_id, input.addressId))
        .limit(1);

      return address || null;
    }),

  // Get pickup address for an order
  getPickupAddress: protectedProcedure
    .input(
      z.object({
        pickupAddressId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const [pickupAddress] = await db
        .select({
          id: pickupAddresses.id,
          nickname: pickupAddresses.nickname,
          isDefault: pickupAddresses.isDefault,
          terminalAddress: getTableColumns(terminalAddresses),
        })
        .from(pickupAddresses)
        .innerJoin(
          terminalAddresses,
          eq(pickupAddresses.terminalAddressId, terminalAddresses.address_id),
        )
        .where(eq(pickupAddresses.id, input.pickupAddressId))
        .limit(1);

      return pickupAddress || null;
    }),

  // Get rate details by rate ID
  getRateDetails: protectedProcedure
    .input(
      z.object({
        rateId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.rateId || input.rateId === "N/A") {
        return null;
      }

      try {
        // Fetch rate details from Terminal API
        const rateResult = await makeTerminalRequest<TerminalGetRateResponse>(
          () => terminalClient.get(`/rates/${input.rateId}`),
          "Failed to fetch rate details",
        );

        return rateResult?.data || null;
      } catch (error) {
        // If rate fetch fails, return null to handle gracefully
        console.error("Failed to fetch rate details:", error);
        return null;
      }
    }),
});

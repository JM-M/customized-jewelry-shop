import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema/orders";
import { cartItems, carts } from "@/db/schema/shop";
import { makeTerminalRequest, terminalClient } from "@/lib/terminal-client";
import { TerminalRate } from "@/modules/terminal/types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { CursorPaginatedResponse } from "@/types/api";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod";

// Helper function to generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
}

export const ordersRouter = createTRPCRouter({
  // Get all orders for the current user
  getUserOrders: protectedProcedure
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
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const whereConditions = [eq(orders.userId, userId)];
      if (input.status) {
        whereConditions.push(eq(orders.status, input.status));
      }

      // Get total count for pagination
      const [{ count: totalCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(orders)
        .where(and(...whereConditions));

      // Get orders with cursor-based pagination and item count
      // Get one extra item to check if there are more items
      const userOrders = await db
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
          itemCount: count(orderItems.id).as("itemCount"),
        })
        .from(orders)
        .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
        .where(and(...whereConditions))
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
        )
        .orderBy(desc(orders.createdAt))
        .offset(input.cursor)
        .limit(input.limit + 1);

      // Check if there are more items
      const hasMore = userOrders.length > input.limit;
      const items = hasMore ? userOrders.slice(0, -1) : userOrders;

      const response: CursorPaginatedResponse<(typeof items)[0]> = {
        items,
        nextCursor: hasMore ? input.cursor + input.limit : undefined,
        totalCount,
      };

      return response;
    }),

  // Get order status by order ID
  getOrderStatus: protectedProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      const [order] = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          status: orders.status,
          subtotal: orders.subtotal,
          deliveryFee: orders.deliveryFee,
          totalAmount: orders.totalAmount,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(
          and(
            eq(orders.orderNumber, input.orderNumber),
            eq(orders.userId, userId),
          ),
        )
        .limit(1);

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found or not accessible",
        });
      }

      return order;
    }),

  // Get user order by order number with full details
  getUserOrder: protectedProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // Get order with basic details
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
          deliveryAddressId: orders.deliveryAddressId,
          pickupAddressId: orders.pickupAddressId,
          shipmentId: orders.shipmentId,
          rateId: orders.rateId,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt,
          shippedAt: orders.shippedAt,
          deliveredAt: orders.deliveredAt,
        })
        .from(orders)
        .where(
          and(
            eq(orders.orderNumber, input.orderNumber),
            eq(orders.userId, userId),
          ),
        )
        .limit(1);

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found or not accessible",
        });
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
          engravings: orderItems.engravings,
          notes: orderItems.notes,
          createdAt: orderItems.createdAt,
        })
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      return {
        ...order,
        items: orderItemsData,
      };
    }),

  // Create order from cart
  createOrder: protectedProcedure
    .input(
      z.object({
        cartId: z.string(),
        deliveryAddressId: z.string().optional(),
        pickupAddressId: z.string().optional(),
        paymentReference: z.string().optional(),
        rateId: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Handle failure modes e.g could not fetch delivery fee.
      // TODO: Handle what should happen to the checkout session.

      const userId = ctx.auth.user.id;

      // Verify cart ownership and get cart with items
      const [cart] = await db
        .select(getTableColumns(carts))
        .from(carts)
        .where(and(eq(carts.id, input.cartId), eq(carts.userId, userId)))
        .limit(1);

      if (!cart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart not found or not accessible",
        });
      }

      // Get cart items with product and material data
      const cartItemsData = await db
        .select({
          ...getTableColumns(cartItems),
        })
        .from(cartItems)
        .where(eq(cartItems.cartId, cart.id));

      if (cartItemsData.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot create order from empty cart",
        });
      }

      // Calculate totals
      let subtotal = 0;
      const orderItemsData = cartItemsData.map((item) => {
        const unitPrice = Number(item.price);
        const quantity = item.quantity;
        const totalPrice = unitPrice * quantity;
        subtotal += totalPrice;

        // Calculate customization additional costs
        let customizationCost = 0;
        if (item.customizations) {
          Object.values(item.customizations).forEach((customization) => {
            if (customization.additionalPrice) {
              customizationCost += customization.additionalPrice * quantity;
            }
          });
        }

        return {
          productId: item.productId,
          materialId: item.materialId,
          quantity: item.quantity,
          unitPrice: unitPrice.toString(),
          totalPrice: (totalPrice + customizationCost).toString(),
          engravings: item.customizations,
          notes: item.notes,
        };
      });

      // Fetch delivery fee from Terminal API if rateId is provided
      let deliveryFee = 0;
      if (input.rateId) {
        const rateResult = await makeTerminalRequest<{
          status: boolean;
          message: string;
          data: TerminalRate;
        }>(
          () => terminalClient.get(`/rates/${input.rateId}`),
          "Failed to get delivery rate",
        );

        if (!rateResult.status || !rateResult.data) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch delivery rate from Terminal API",
          });
        }

        deliveryFee = rateResult.data.amount;
      }

      const totalAmount = subtotal + deliveryFee;

      // Create order
      const [newOrder] = await db
        .insert(orders)
        .values({
          orderNumber: generateOrderNumber(),
          userId: userId,
          subtotal: subtotal.toString(),
          deliveryFee: deliveryFee.toString(),
          totalAmount: totalAmount.toString(),
          status: "confirmed",
          paymentReference: input.paymentReference,
          deliveryAddressId: input.deliveryAddressId,
          pickupAddressId: input.pickupAddressId,
          rateId: input.rateId,
        })
        .returning();

      // Create order items
      const newOrderItems = await db
        .insert(orderItems)
        .values(
          orderItemsData.map((item) => ({
            orderId: newOrder.id,
            productId: item.productId,
            materialId: item.materialId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            engravings: item.engravings,
            notes: item.notes,
          })),
        )
        .returning();

      // Clear cart items after successful order creation
      await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

      return {
        order: newOrder,
        items: newOrderItems,
      };
    }),
});

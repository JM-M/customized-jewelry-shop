import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { CUSTOMIZATION_TYPES } from "@/constants/db";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { pickupAddresses, terminalAddresses } from "@/db/schema/logistics";
import { orderItems, orders } from "@/db/schema/orders";
import { materials, products } from "@/db/schema/shop";
import { makeTerminalRequest, terminalClient } from "@/lib/terminal-client";
import { CustomizationType } from "@/modules/products/types";
import {
  TerminalGetRateResponse,
  TerminalRate,
} from "@/modules/terminal/types";
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
          ...getTableColumns(orders),
          // User details
          customer: {
            ...getTableColumns(user),
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

  // Create order (admin)
  createOrder: protectedProcedure
    .input(
      z.object({
        customerId: z.string().optional(),
        customerEmail: z.string().email(),
        customerFirstName: z.string().min(2),
        customerLastName: z.string().min(2),
        items: z
          .array(
            z.object({
              productId: z.string(),
              materialId: z.string(),
              quantity: z.number().min(1),
              unitPrice: z.number().min(0),
              notes: z.string().optional(),
              customizations: z
                .record(
                  z.string(),
                  z.object({
                    type: z.enum(CUSTOMIZATION_TYPES),
                    textContent: z.string().optional(),
                    imageUrl: z.string().optional(),
                    qrData: z.string().optional(),
                    additionalPrice: z.number().optional(),
                  }),
                )
                .optional(),
            }),
          )
          .min(1, "At least one item is required"),
        deliveryAddressId: z.string().min(1, "Delivery address is required"),
        rateId: z.string().min(1, "Delivery rate is required"),
      }),
    )
    .mutation(async ({ input }) => {
      // Fetch default pickup address
      const [defaultPickupAddress] = await db
        .select()
        .from(pickupAddresses)
        .where(eq(pickupAddresses.isDefault, true))
        .limit(1);

      if (!defaultPickupAddress) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message:
            "No default pickup address found. Please set a default pickup address before creating orders.",
        });
      }

      // Verify customer exists (if customerId provided)
      let userId = input.customerId;

      if (!userId) {
        // If no customerId, look up user by email
        const [existingUser] = await db
          .select()
          .from(user)
          .where(eq(user.email, input.customerEmail))
          .limit(1);

        if (!existingUser) {
          // TODO: Create customer or at least create a user that can be merged when someone signs up with it.
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Customer not found. Please create the customer first.",
          });
        }

        userId = existingUser.id;
      }

      // Calculate totals
      let subtotal = 0;
      const orderItemsData = input.items.map((item) => {
        const unitPrice = item.unitPrice;
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

        // Convert customizations to database format
        const dbCustomizations: {
          [key: string]: {
            name: string;
            type: CustomizationType;
            content: string;
            additionalPrice?: number;
          };
        } = {};

        if (item.customizations) {
          Object.entries(item.customizations).forEach(([key, value]) => {
            let content = "";
            if (value.type === "text") {
              content = value.textContent || "";
            } else if (value.type === "image") {
              content = value.imageUrl || "";
            } else if (value.type === "qr_code") {
              content = value.qrData || "";
            }

            dbCustomizations[key] = {
              name: key, // Use the key as the name
              type: value.type,
              content,
              additionalPrice: value.additionalPrice,
            };
          });
        }

        return {
          productId: item.productId,
          materialId: item.materialId,
          quantity: item.quantity,
          unitPrice: unitPrice.toString(),
          totalPrice: (totalPrice + customizationCost).toString(),
          customizations: dbCustomizations,
          notes: item.notes,
        };
      });

      // Fetch delivery fee from Terminal API
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

      const deliveryFee = rateResult.data.amount;

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
          status: "pending",
          deliveryAddressId: input.deliveryAddressId,
          pickupAddressId: defaultPickupAddress.id,
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
            customizations: item.customizations,
            notes: item.notes,
          })),
        )
        .returning();

      return {
        order: newOrder,
        items: newOrderItems,
      };
    }),
});

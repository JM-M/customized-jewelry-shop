import { db } from "@/db";
import { orderItems, orders } from "@/db/schema/orders";
import { cartItems, carts } from "@/db/schema/shop";
import { makeTerminalRequest, terminalClient } from "@/lib/terminal-client";
import { TerminalRate } from "@/modules/terminal/types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

// Helper function to generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
}

export const ordersRouter = createTRPCRouter({
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

        // Calculate engraving additional costs
        let engravingCost = 0;
        if (item.engravings) {
          Object.values(item.engravings).forEach((engraving) => {
            if (engraving.additionalPrice) {
              engravingCost += engraving.additionalPrice * quantity;
            }
          });
        }

        return {
          productId: item.productId,
          materialId: item.materialId,
          quantity: item.quantity,
          unitPrice: unitPrice.toString(),
          totalPrice: (totalPrice + engravingCost).toString(),
          engravings: item.engravings,
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
          status: "pending",
          paymentReference: input.paymentReference,
          deliveryAddressId: input.deliveryAddressId,
          pickupAddressId: input.pickupAddressId,
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

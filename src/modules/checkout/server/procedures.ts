import { db } from "@/db";
import { checkoutSessions } from "@/db/schema/logistics";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Schema for upserting checkout session
const upsertCheckoutSessionSchema = z.object({
  selectedAddressId: z.string().nullable().optional(),
  rateId: z.string().nullable().optional(),
  // TODO: Add other fields like parcelId, shipmentId, checkoutStep, cartSnapshot, etc.
});

export const checkoutRouter = createTRPCRouter({
  upsertCheckoutSession: protectedProcedure
    .input(upsertCheckoutSessionSchema)
    .mutation(async ({ input, ctx }) => {
      const { selectedAddressId, rateId } = input;
      const userId = ctx.auth.user.id;

      try {
        // Check if checkout session exists for this user
        const [existingSession] = await db
          .select()
          .from(checkoutSessions)
          .where(eq(checkoutSessions.userId, userId))
          .limit(1);

        if (existingSession) {
          // Update existing session
          const [updatedSession] = await db
            .update(checkoutSessions)
            .set({
              selectedAddressId,
              rateId,
              updatedAt: new Date(),
            })
            .where(eq(checkoutSessions.id, existingSession.id))
            .returning();

          return updatedSession;
        } else {
          // Create new session
          const [newSession] = await db
            .insert(checkoutSessions)
            .values({
              userId,
              selectedAddressId,
              rateId,
              checkoutStep: "address_selected", // Default step
              status: "active",
            })
            .returning();

          return newSession;
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upsert checkout session",
          cause: error,
        });
      }
    }),

  getCheckoutSession: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    try {
      const [session] = await db
        .select()
        .from(checkoutSessions)
        .where(eq(checkoutSessions.userId, userId))
        .limit(1);

      return session || null;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get checkout session",
        cause: error,
      });
    }
  }),
});

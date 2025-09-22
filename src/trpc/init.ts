import { db } from "@/db";
import { user as usersTable } from "@/db/schema/auth";
import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const publicProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });

  return next({ ctx: { ...ctx, auth: session } });
});

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Fetch user role from database
  const [user] = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, ctx.auth.user.id))
    .limit(1);

  if (!user?.role || !["admin", "super_admin"].includes(user.role))
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Access denied.",
    });

  return next({ ctx: { ...ctx, role: user.role } });
});

export const superAdminProcedure = adminProcedure.use(async ({ ctx, next }) => {
  if (ctx.role !== "super_admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Access denied.",
    });
  }
  return next({ ctx });
});

import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { desc, eq, ilike, or } from "drizzle-orm";
import { z } from "zod";

export const adminUsersRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(0),
        limit: z.number().min(1).max(100).default(20),
        search: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { cursor, limit, search } = input;
      const offset = cursor * limit;

      let whereCondition;
      if (search) {
        whereCondition = or(
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`),
        );
      }

      const users = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .where(whereCondition)
        .orderBy(desc(user.createdAt))
        .limit(limit)
        .offset(offset);

      const totalCount = await db
        .select({ count: user.id })
        .from(user)
        .where(whereCondition);

      return {
        items: users,
        totalCount: totalCount.length,
        hasMore: users.length === limit,
        nextCursor: users.length === limit ? cursor + 1 : null,
      };
    }),

  searchUsers: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search query is required"),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ input }) => {
      const users = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .where(ilike(user.email, `%${input.query}%`))
        .limit(input.limit);

      return {
        users,
      };
    }),

  getUserById: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1, "User ID is required"),
      }),
    )
    .query(async ({ input }) => {
      const userData = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
        .from(user)
        .where(eq(user.id, input.userId))
        .limit(1);

      if (userData.length === 0) {
        throw new Error("User not found");
      }

      return userData[0];
    }),
});

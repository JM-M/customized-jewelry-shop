import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { ilike } from "drizzle-orm";
import { z } from "zod";

export const adminUsersRouter = createTRPCRouter({
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
});

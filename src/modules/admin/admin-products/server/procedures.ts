import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { products } from "@/db/schema/products";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { CursorPaginatedResponse } from "@/types/api";
import { sql } from "drizzle-orm";
import z from "zod";

export const adminProductsRouter = createTRPCRouter({
  getProducts: adminProcedure
    .input(
      z.object({
        cursor: z.number().default(0),
        limit: z.number().min(1).max(20).default(DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ input }) => {
      // Get total count for pagination
      const [{ count: totalCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(products);

      // Get products with cursor-based pagination
      // Get one extra item to check if there are more items
      const adminProducts = await db
        .select()
        .from(products)
        .offset(input.cursor)
        .limit(input.limit + 1);

      // Check if there are more items
      const hasMore = adminProducts.length > input.limit;
      const items = hasMore ? adminProducts.slice(0, -1) : adminProducts;

      const response: CursorPaginatedResponse<(typeof items)[0]> = {
        items,
        nextCursor: hasMore ? input.cursor + input.limit : undefined,
        totalCount,
      };

      return response;
    }),
});

import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { categories, products } from "@/db/schema/products";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { CursorPaginatedResponse } from "@/types/api";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns, sql } from "drizzle-orm";
import z from "zod";

export const productsProcedure = createTRPCRouter({
  getManyByCategorySlug: baseProcedure
    .input(
      z.object({
        categorySlug: z.string(),
        cursor: z.number().default(0),
        limit: z.number().default(DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ input }) => {
      const [category] = await db
        .select({
          id: categories.id,
          parentId: categories.parentId,
        })
        .from(categories)
        .where(eq(categories.slug, input.categorySlug));
      const categoryId = category?.id;

      if (!categoryId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Build the where condition
      const whereCondition =
        category.parentId === null
          ? // If it's a parent category, get products from all child categories
            eq(categories.parentId, categoryId)
          : // If it's a child category, get products from this category only
            eq(products.categoryId, categoryId);

      // Get total count for pagination
      const [{ count: totalCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(whereCondition);

      // Get products with cursor-based pagination
      // Get one extra item to check if there are more items
      const categoryProducts = await db
        .select({
          // Product fields
          ...getTableColumns(products),
          // Category info (aliased to avoid conflicts)
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(whereCondition)
        .offset(input.cursor)
        .limit(input.limit + 1);

      // Check if there are more items
      const hasMore = categoryProducts.length > input.limit;
      const items = hasMore ? categoryProducts.slice(0, -1) : categoryProducts;

      const response: CursorPaginatedResponse<(typeof items)[0]> = {
        items,
        nextCursor: hasMore ? input.cursor + input.limit : undefined,
        totalCount,
      };

      return response;
    }),

  getById: baseProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id));
      return product;
    }),
});

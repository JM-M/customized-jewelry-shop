import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { orderItems, orders } from "@/db/schema/orders";
import {
  categories,
  customizationOptions,
  materials,
  productMaterials,
  productReviews,
  products,
} from "@/db/schema/shop";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { CursorPaginatedResponse } from "@/types/api";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, getTableColumns, ne, sql } from "drizzle-orm";
import z from "zod";

export const productsRouter = createTRPCRouter({
  getNewArrivals: baseProcedure
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
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id));

      // Get products with cursor-based pagination
      // Get one extra item to check if there are more items
      const newArrivals = await db
        .select({
          // Product fields
          ...getTableColumns(products),
          // Category info (aliased to avoid conflicts)
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .orderBy(desc(products.createdAt))
        .offset(input.cursor)
        .limit(input.limit + 1);

      // Check if there are more items
      const hasMore = newArrivals.length > input.limit;
      const items = hasMore ? newArrivals.slice(0, -1) : newArrivals;

      const response: CursorPaginatedResponse<(typeof items)[0]> = {
        items,
        nextCursor: hasMore ? input.cursor + input.limit : undefined,
        totalCount,
      };

      return response;
    }),

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

  getBySlug: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.slug, input.slug));
      return product;
    }),

  getProductMaterials: baseProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      return await db
        .select({
          ...getTableColumns(productMaterials),
          material: { ...getTableColumns(materials) },
        })
        .from(productMaterials)
        .innerJoin(materials, eq(productMaterials.materialId, materials.id))
        .where(eq(productMaterials.productId, input.productId));
    }),

  getProductCustomizationOptions: baseProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(customizationOptions)
        .where(
          and(
            eq(customizationOptions.productId, input.productId),
            eq(customizationOptions.isActive, true),
          ),
        )
        .orderBy(customizationOptions.displayOrder);

      return result;
    }),

  // Review procedures
  getProductReviews: baseProcedure
    .input(
      z.object({
        productId: z.string(),
        cursor: z.number().default(0),
        limit: z.number().min(1).max(50).default(DEFAULT_PAGE_SIZE),
        sortBy: z
          .enum(["newest", "oldest", "highest", "lowest"])
          .default("newest"),
        excludeUserId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      // Get total count for pagination
      const [{ count: totalCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(productReviews)
        .where(
          input.excludeUserId
            ? and(
                eq(productReviews.productId, input.productId),
                ne(productReviews.userId, input.excludeUserId),
              )
            : eq(productReviews.productId, input.productId),
        );

      // Determine sort order
      const orderBy =
        input.sortBy === "newest"
          ? desc(productReviews.createdAt)
          : input.sortBy === "oldest"
            ? asc(productReviews.createdAt)
            : input.sortBy === "highest"
              ? desc(productReviews.rating)
              : asc(productReviews.rating);

      // Get reviews with pagination
      const reviews = await db
        .select({
          ...getTableColumns(productReviews),
          // User info (first name and last name only for privacy)
          userFirstName: user.firstName,
          userLastName: user.lastName,
        })
        .from(productReviews)
        .innerJoin(user, eq(productReviews.userId, user.id))
        .where(
          input.excludeUserId
            ? and(
                eq(productReviews.productId, input.productId),
                ne(productReviews.userId, input.excludeUserId),
              )
            : eq(productReviews.productId, input.productId),
        )
        .orderBy(orderBy)
        .offset(input.cursor)
        .limit(input.limit + 1);

      // Check if there are more items
      const hasMore = reviews.length > input.limit;
      const items = hasMore ? reviews.slice(0, -1) : reviews;

      const response: CursorPaginatedResponse<(typeof items)[0]> = {
        items,
        nextCursor: hasMore ? input.cursor + input.limit : undefined,
        totalCount,
      };

      return response;
    }),

  getProductReviewStats: baseProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      const [stats] = await db
        .select({
          totalReviews: sql<number>`count(*)`,
          averageRating: sql<number>`avg(rating)`,
          fiveStars: sql<number>`count(*) filter (where rating = 5)`,
          fourStars: sql<number>`count(*) filter (where rating = 4)`,
          threeStars: sql<number>`count(*) filter (where rating = 3)`,
          twoStars: sql<number>`count(*) filter (where rating = 2)`,
          oneStar: sql<number>`count(*) filter (where rating = 1)`,
        })
        .from(productReviews)
        .where(eq(productReviews.productId, input.productId));

      return {
        totalReviews: stats.totalReviews || 0,
        averageRating: stats.averageRating
          ? Number(stats.averageRating.toFixed(1))
          : 0,
        ratingDistribution: {
          fiveStars: stats.fiveStars || 0,
          fourStars: stats.fourStars || 0,
          threeStars: stats.threeStars || 0,
          twoStars: stats.twoStars || 0,
          oneStar: stats.oneStar || 0,
        },
      };
    }),

  createProductReview: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(10).max(1000),
        title: z.string().min(3).max(100).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // Check if user has already reviewed this product
      const [existingReview] = await db
        .select({ id: productReviews.id })
        .from(productReviews)
        .where(
          and(
            eq(productReviews.productId, input.productId),
            eq(productReviews.userId, userId),
          ),
        );

      if (existingReview) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already reviewed this product",
        });
      }

      // Verify product exists
      const [product] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.id, input.productId));

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Create the review
      const [newReview] = await db
        .insert(productReviews)
        .values({
          productId: input.productId,
          userId,
          rating: input.rating,
          comment: input.comment,
          title: input.title,
        })
        .returning();

      return newReview;
    }),

  updateProductReview: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1).max(5).optional(),
        comment: z.string().min(10).max(1000).optional(),
        title: z.string().min(3).max(100).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // Verify review exists and belongs to user
      const [existingReview] = await db
        .select({ id: productReviews.id, userId: productReviews.userId })
        .from(productReviews)
        .where(eq(productReviews.id, input.reviewId));

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (existingReview.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own reviews",
        });
      }

      // Update the review
      const [updatedReview] = await db
        .update(productReviews)
        .set({
          rating: input.rating,
          comment: input.comment,
          title: input.title,
          updatedAt: new Date(),
        })
        .where(eq(productReviews.id, input.reviewId))
        .returning();

      return updatedReview;
    }),

  deleteProductReview: protectedProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // Verify review exists and belongs to user
      const [existingReview] = await db
        .select({ id: productReviews.id, userId: productReviews.userId })
        .from(productReviews)
        .where(eq(productReviews.id, input.reviewId));

      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      if (existingReview.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own reviews",
        });
      }

      // Delete the review
      await db
        .delete(productReviews)
        .where(eq(productReviews.id, input.reviewId));

      return { success: true };
    }),

  // Get user's purchase status and existing review for a product
  getUserProductReviewStatus: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.user.id;

      // Check if user has any delivered orders containing this product
      const [purchaseRecord] = await db
        .select({ id: orderItems.id })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(
            eq(orderItems.productId, input.productId),
            eq(orders.userId, userId),
            eq(orders.status, "delivered"),
          ),
        )
        .limit(1);

      const hasPurchased = !!purchaseRecord;

      // If user hasn't purchased, return early
      if (!hasPurchased) {
        return {
          hasPurchased: false,
          userReview: null,
        };
      }

      // Get user's existing review for this product
      const [userReview] = await db
        .select({
          id: productReviews.id,
          rating: productReviews.rating,
          title: productReviews.title,
          comment: productReviews.comment,
          createdAt: productReviews.createdAt,
          updatedAt: productReviews.updatedAt,
        })
        .from(productReviews)
        .where(
          and(
            eq(productReviews.productId, input.productId),
            eq(productReviews.userId, userId),
          ),
        )
        .limit(1);

      return {
        hasPurchased: true,
        userReview: userReview || null,
      };
    }),
});

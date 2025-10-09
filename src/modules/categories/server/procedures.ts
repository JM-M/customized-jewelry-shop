import { db } from "@/db";
import { categories, productMaterials, products } from "@/db/schema/shop";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, isNull, sql } from "drizzle-orm";
import z from "zod";

export const categoriesRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    const allCategories = await db.select().from(categories);

    if (!allCategories)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Categories not found",
      });
    return allCategories;
  }),
  getParentCategories: baseProcedure.query(async () => {
    const parentCategories = await db
      .select()
      .from(categories)
      .where(isNull(categories.parentId));

    return parentCategories;
  }),

  getCategoryStats: baseProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { categoryId } = input;

      // Get category info
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId));

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Get subcategories count
      const subcategoriesResult = await db
        .select({ count: sql<number>`count(*)`.as("count") })
        .from(categories)
        .where(eq(categories.parentId, categoryId));

      const subcategoriesCount = subcategoriesResult[0]?.count || 0;

      // Get products stats
      // Note: Total stock is now calculated from productMaterials (sum of all material variants)
      const productsStats = await db
        .select({
          totalProducts: sql<number>`count(distinct ${products.id})`.as(
            "totalProducts",
          ),
          totalStock:
            sql<number>`coalesce(sum(${productMaterials.stockQuantity}), 0)`.as(
              "totalStock",
            ),
          averagePrice: sql<number>`coalesce(avg(${products.price}), 0)`.as(
            "averagePrice",
          ),
        })
        .from(products)
        .leftJoin(productMaterials, eq(products.id, productMaterials.productId))
        .where(eq(products.categoryId, categoryId));

      const stats = productsStats[0];

      return {
        category,
        subcategoriesCount,
        totalProducts: stats?.totalProducts || 0,
        totalStock: stats?.totalStock || 0,
        averagePrice: stats?.averagePrice || 0,
      };
    }),

  getProductsByCategory: baseProcedure
    .input(
      z.object({
        categoryId: z.string(),
        cursor: z.number().default(0),
        limit: z.number().default(20),
        includeSubcategories: z.boolean().default(true),
      }),
    )
    .query(async ({ input }) => {
      const { categoryId, cursor, limit, includeSubcategories } = input;

      // First, get the category info to determine if it's a parent or child
      const [category] = await db
        .select({
          id: categories.id,
          parentId: categories.parentId,
        })
        .from(categories)
        .where(eq(categories.id, categoryId));

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Build the where condition based on category type and includeSubcategories flag
      let whereCondition;
      if (includeSubcategories && category.parentId === null) {
        // If it's a parent category and we want to include subcategories,
        // get products from all child categories
        whereCondition = sql`${products.categoryId} IN (
          SELECT id FROM categories 
          WHERE parent_id = ${categoryId}
        )`;
      } else {
        // Otherwise, get products directly from this category
        whereCondition = eq(products.categoryId, categoryId);
      }

      // Get total count
      const [{ count: totalCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(products)
        .where(whereCondition);

      // Get products with pagination, including category info
      const categoryProducts = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          description: products.description,
          price: products.price,
          categoryId: products.categoryId,
          packagingId: products.packagingId,
          primaryImage: products.primaryImage,
          images: products.images,
          metaTitle: products.metaTitle,
          metaDescription: products.metaDescription,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          // Include category info for better context
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(whereCondition)
        .offset(cursor)
        .limit(limit + 1);

      const hasMore = categoryProducts.length > limit;
      const items = hasMore ? categoryProducts.slice(0, -1) : categoryProducts;

      return {
        items,
        nextCursor: hasMore ? cursor + limit : undefined,
        totalCount,
      };
    }),

  getProductsByCategorySlug: baseProcedure
    .input(
      z.object({
        categorySlug: z.string(),
        cursor: z.number().default(0),
        limit: z.number().default(20),
        includeSubcategories: z.boolean().default(true),
      }),
    )
    .query(async ({ input }) => {
      const { categorySlug, cursor, limit, includeSubcategories } = input;

      // Get the category by slug
      const [category] = await db
        .select({
          id: categories.id,
          parentId: categories.parentId,
        })
        .from(categories)
        .where(eq(categories.slug, categorySlug));

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Build the where condition based on category type and includeSubcategories flag
      let whereCondition;
      if (includeSubcategories && category.parentId === null) {
        // If it's a parent category and we want to include subcategories,
        // get products from all child categories
        whereCondition = sql`${products.categoryId} IN (
          SELECT id FROM categories 
          WHERE parent_id = ${category.id}
        )`;
      } else {
        // Otherwise, get products directly from this category
        whereCondition = eq(products.categoryId, category.id);
      }

      // Get total count
      const [{ count: totalCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(products)
        .where(whereCondition);

      // Get products with pagination, including category info
      const categoryProducts = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          description: products.description,
          price: products.price,
          categoryId: products.categoryId,
          packagingId: products.packagingId,
          primaryImage: products.primaryImage,
          images: products.images,
          metaTitle: products.metaTitle,
          metaDescription: products.metaDescription,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          // Include category info for better context
          categoryName: categories.name,
          categorySlug: categories.slug,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(whereCondition)
        .offset(cursor)
        .limit(limit + 1);

      const hasMore = categoryProducts.length > limit;
      const items = hasMore ? categoryProducts.slice(0, -1) : categoryProducts;

      return {
        items,
        nextCursor: hasMore ? cursor + limit : undefined,
        totalCount,
        category,
      };
    }),
});

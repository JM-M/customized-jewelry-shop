import { db } from "@/db";
import { categories, products } from "@/db/schema/shop";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod";

export const adminCategoriesRouter = createTRPCRouter({
  getCategoryWithSubcategories: adminProcedure
    .input(
      z.object({
        categorySlug: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { categorySlug } = input;

      // Get the main category by slug
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, categorySlug));

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Get parent category if this is a subcategory
      let parentCategory = null;
      if (category.parentId) {
        const [parent] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, category.parentId));
        parentCategory = parent || null;
      }

      // Get subcategories with product counts (only if this is a parent category)
      let subcategories: (typeof category & { productCount: number })[] = [];
      if (!category.parentId) {
        subcategories = await db
          .select({
            ...getTableColumns(categories),
            productCount: sql<number>`coalesce((
              SELECT count(*) 
              FROM products 
              WHERE products.category_id = categories.id
            ), 0)`.as("productCount"),
          })
          .from(categories)
          .where(eq(categories.parentId, category.id))
          .orderBy(categories.name);
      }

      return {
        category,
        parentCategory,
        subcategories,
      };
    }),

  getProductsWithSubcategories: adminProcedure
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
        .select()
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
      if (includeSubcategories && !category.parentId) {
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
          ...getTableColumns(products),
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

  createCategory: adminProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Name is required")
          .max(100, "Name must be less than 100 characters"),
        slug: z
          .string()
          .min(1, "Slug is required")
          .max(100, "Slug must be less than 100 characters"),
        description: z
          .string()
          .max(500, "Description must be less than 500 characters")
          .optional(),
        image: z.string().min(1, "Image is required"),
        parentId: z.string().uuid().optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input }) => {
      const { name, slug, description, image, parentId, isActive } = input;

      // Check if slug already exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug));

      if (existingCategory) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A category with this slug already exists",
        });
      }

      // If parentId is provided, validate it exists and is a top-level category
      if (parentId) {
        const [parentCategory] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, parentId));

        if (!parentCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent category not found",
          });
        }

        if (parentCategory.parentId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot create subcategory of a subcategory",
          });
        }
      }

      // Create the category
      const [newCategory] = await db
        .insert(categories)
        .values({
          name,
          slug,
          description,
          image,
          parentId: parentId || null,
          isActive,
        })
        .returning();

      return newCategory;
    }),

  updateCategory: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z
          .string()
          .min(1, "Name is required")
          .max(100, "Name must be less than 100 characters"),
        slug: z
          .string()
          .min(1, "Slug is required")
          .max(100, "Slug must be less than 100 characters"),
        description: z
          .string()
          .max(500, "Description must be less than 500 characters")
          .optional(),
        image: z.string().min(1, "Image is required"),
        parentId: z.string().uuid().optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, name, slug, description, image, parentId, isActive } = input;

      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Check if slug already exists (excluding current category)
      const [slugConflict] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug));

      if (slugConflict && slugConflict.id !== id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A category with this slug already exists",
        });
      }

      // If parentId is provided, validate it exists and is a top-level category
      if (parentId) {
        const [parentCategory] = await db
          .select()
          .from(categories)
          .where(eq(categories.id, parentId));

        if (!parentCategory) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Parent category not found",
          });
        }

        if (parentCategory.parentId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot create subcategory of a subcategory",
          });
        }

        // Prevent circular reference (category cannot be its own parent)
        if (parentId === id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Category cannot be its own parent",
          });
        }
      }

      // Update the category
      const [updatedCategory] = await db
        .update(categories)
        .set({
          name,
          slug,
          description,
          image,
          parentId: parentId || null,
          isActive,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, id))
        .returning();

      return updatedCategory;
    }),

  deleteCategory: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      // Check if category exists
      const [existingCategory] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id));

      if (!existingCategory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      // Check if category has products
      const [{ count: productCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(products)
        .where(eq(products.categoryId, id));

      if (productCount > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete category with existing products",
        });
      }

      // Check if category has subcategories
      const [{ count: subcategoryCount }] = await db
        .select({
          count: sql<number>`count(*)`.as("count"),
        })
        .from(categories)
        .where(eq(categories.parentId, id));

      if (subcategoryCount > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete category with existing subcategories",
        });
      }

      // Delete the category
      await db.delete(categories).where(eq(categories.id, id));

      return { success: true };
    }),
});

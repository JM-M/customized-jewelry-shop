import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { db } from "@/db";
import { materials, productMaterials, products } from "@/db/schema/shop";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { CursorPaginatedResponse } from "@/types/api";
import { and, eq, sql } from "drizzle-orm";
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

  getAllMaterials: adminProcedure.query(async () => {
    const allMaterials = await db
      .select()
      .from(materials)
      .orderBy(materials.name);

    return allMaterials;
  }),
  toggleProductMaterial: adminProcedure
    .input(
      z.object({
        productId: z.string(),
        materialId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { productId, materialId } = input;
      const [productMaterial] = await db
        .select()
        .from(productMaterials)
        .where(
          and(
            eq(productMaterials.productId, productId),
            eq(productMaterials.materialId, materialId),
          ),
        );

      if (productMaterial) {
        await db
          .delete(productMaterials)
          .where(eq(productMaterials.id, productMaterial.id));
      } else {
        await db.insert(productMaterials).values({
          productId,
          materialId,
          price: "0",
          stockQuantity: 0,
          isDefault: false,
        });
      }

      return {
        success: true,
      };
    }),

  updateProductMaterials: adminProcedure
    .input(
      z.object({
        productId: z.string(),
        materialIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      const { productId, materialIds } = input;

      // First, remove all existing product materials for this product
      await db
        .delete(productMaterials)
        .where(eq(productMaterials.productId, productId));

      // Then, insert the new materials
      if (materialIds.length > 0) {
        await db.insert(productMaterials).values(
          materialIds.map((materialId) => ({
            productId,
            materialId,
            price: "0",
            stockQuantity: 0,
            isDefault: false,
          })),
        );
      }

      return {
        success: true,
      };
    }),
});

import { DEFAULT_PAGE_SIZE } from "@/constants/api";
import { CUSTOMIZATION_TYPES } from "@/constants/db";
import { db } from "@/db";
import {
  customizationOptions,
  materials,
  productMaterials,
  products,
} from "@/db/schema/shop";
import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import { CursorPaginatedResponse } from "@/types/api";
import { and, eq, ilike, sql } from "drizzle-orm";
import z from "zod";

export const adminProductsRouter = createTRPCRouter({
  getProductForEdit: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const product = await db.query.products.findFirst({
        where: eq(products.slug, input.slug),
        with: {
          category: true,
          materials: {
            with: {
              material: true,
            },
            orderBy: (pm, { asc }) => [asc(pm.createdAt)],
          },
          customizationOptions: {
            orderBy: (co, { asc }) => [asc(co.displayOrder), asc(co.createdAt)],
          },
        },
      });

      return product;
    }),
  searchProducts: adminProcedure
    .input(
      z.object({
        query: z.string().min(1, "Query is required"),
        limit: z.number().min(1).max(20).default(10),
      }),
    )
    .query(async ({ input }) => {
      const searchResults = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          primaryImage: products.primaryImage,
        })
        .from(products)
        .where(ilike(products.name, `%${input.query}%`))
        .limit(input.limit)
        .orderBy(products.name);

      return {
        products: searchResults,
      };
    }),

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
      const adminProducts = await db.query.products.findMany({
        offset: input.cursor,
        limit: input.limit + 1,
        with: {
          materials: {
            with: {
              material: true,
            },
          },
        },
      });

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
        // Get the product to use its slug for SKU generation
        const [product] = await db
          .select({ slug: products.slug })
          .from(products)
          .where(eq(products.id, productId));

        // Count existing materials to generate next SKU number
        const existingMaterials = await db
          .select()
          .from(productMaterials)
          .where(eq(productMaterials.productId, productId));

        await db.insert(productMaterials).values({
          productId,
          materialId,
          sku: `${product.slug.toUpperCase()}_MAT-${existingMaterials.length + 1}`,
          price: "0",
          stockQuantity: 0,
          lowStockThreshold: 10,
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
        // Get the product to use its slug for SKU generation
        const [product] = await db
          .select({ slug: products.slug })
          .from(products)
          .where(eq(products.id, productId));

        await db.insert(productMaterials).values(
          materialIds.map((materialId, index) => ({
            productId,
            materialId,
            sku: `${product.slug.toUpperCase()}_MAT-${index + 1}`,
            price: "0",
            stockQuantity: 0,
            lowStockThreshold: 10,
            isDefault: false,
          })),
        );
      }

      return {
        success: true,
      };
    }),

  createCustomizationOption: adminProcedure
    .input(
      z.object({
        productId: z.string(),
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        type: z.enum(CUSTOMIZATION_TYPES),
        sampleImage: z.string().optional(),
        maxCharacters: z.number().min(1).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const customizationOption = await db
        .insert(customizationOptions)
        .values({
          productId: input.productId,
          name: input.name,
          description: input.description,
          type: input.type,
          sampleImage: input.sampleImage,
          maxCharacters: input.maxCharacters,
        })
        .returning();

      return {
        success: true,
        customizationOption: customizationOption[0],
      };
    }),

  getCustomizationOptions: adminProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const options = await db
        .select()
        .from(customizationOptions)
        .where(eq(customizationOptions.productId, input.productId))
        .orderBy(
          customizationOptions.displayOrder,
          customizationOptions.createdAt,
        );

      return options;
    }),

  removeCustomizationOption: adminProcedure
    .input(
      z.object({
        optionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(customizationOptions)
        .where(eq(customizationOptions.id, input.optionId));

      return {
        success: true,
      };
    }),

  createProduct: adminProcedure
    .input(
      z.object({
        // Basic information
        name: z.string().min(1, "Product name is required"),
        slug: z.string().min(1, "Slug is required"),
        description: z.string().optional(),
        categoryId: z.string().min(1, "Category is required"),
        price: z.string().min(1, "Price is required"),
        packagingId: z.string().optional(),
        // Images
        images: z
          .array(z.string())
          .min(1, "At least one image is required")
          .max(9, "Maximum 9 images allowed"),
        // Materials
        materials: z
          .array(
            z.object({
              materialId: z.string(),
              price: z.string().min(1, "Price is required"),
              stockQuantity: z.string(),
              lowStockThreshold: z.string(),
              isDefault: z.boolean(),
            }),
          )
          .optional(),
        // Customization options
        customizationOptions: z
          .array(
            z.object({
              name: z.string().min(1, "Name is required"),
              description: z.string().optional(),
              type: z.enum(CUSTOMIZATION_TYPES),
              maxCharacters: z.string().optional(),
              sampleImage: z.string().optional(),
            }),
          )
          .optional(),
        // SEO metadata
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        name,
        slug,
        description,
        categoryId,
        price,
        packagingId,
        images,
        materials: inputMaterials,
        customizationOptions: inputCustomizationOptions,
        metaTitle,
        metaDescription,
      } = input;

      // Create the product
      const [newProduct] = await db
        .insert(products)
        .values({
          name,
          slug,
          description,
          categoryId,
          price,
          packagingId: packagingId || undefined,
          primaryImage: images[0],
          images,
          metaTitle: metaTitle || undefined,
          metaDescription: metaDescription || undefined,
        })
        .returning();

      // Create product materials if provided
      let createdMaterials:
        | (typeof productMaterials.$inferSelect)[]
        | undefined;
      if (inputMaterials && inputMaterials.length > 0) {
        createdMaterials = await db
          .insert(productMaterials)
          .values(
            inputMaterials.map((material, index) => ({
              productId: newProduct.id,
              materialId: material.materialId,
              // Generate SKU: product-slug_material-index (e.g., "DN-001_MAT-1")
              sku: `${newProduct.slug.toUpperCase()}_MAT-${index + 1}`,
              price: material.price,
              stockQuantity: parseInt(material.stockQuantity),
              lowStockThreshold: parseInt(material.lowStockThreshold),
              isDefault: material.isDefault,
            })),
          )
          .returning();
      }

      // Create customization options if provided
      let createdCustomizationOptions:
        | (typeof customizationOptions.$inferSelect)[]
        | undefined;
      if (inputCustomizationOptions && inputCustomizationOptions.length > 0) {
        createdCustomizationOptions = await db
          .insert(customizationOptions)
          .values(
            inputCustomizationOptions.map((option, index) => ({
              productId: newProduct.id,
              name: option.name,
              description: option.description || undefined,
              type: option.type,
              maxCharacters: option.maxCharacters
                ? parseInt(option.maxCharacters)
                : undefined,
              sampleImage: option.sampleImage || undefined,
              displayOrder: index,
            })),
          )
          .returning();
      }

      return {
        success: true,
        product: newProduct,
        materials: createdMaterials,
        customizationOptions: createdCustomizationOptions,
      };
    }),

  updateProduct: adminProcedure
    .input(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        // Basic information
        name: z.string().min(1, "Product name is required").optional(),
        description: z.string().optional(),
        categoryId: z.string().optional(),
        price: z.string().optional(),
        // Images
        images: z
          .array(z.string())
          .min(1, "At least one image is required")
          .max(9, "Maximum 9 images allowed")
          .optional(),
        // Materials
        materials: z
          .array(
            z.object({
              materialId: z.string(),
              price: z.string().min(1, "Price is required"),
              stockQuantity: z.string(),
              lowStockThreshold: z.string(),
              isDefault: z.boolean(),
            }),
          )
          .optional(),
        // Customization options
        customizationOptions: z
          .array(
            z.object({
              id: z.string().optional(), // Optional for new options
              name: z.string().min(1, "Name is required"),
              description: z.string().optional(),
              type: z.enum(CUSTOMIZATION_TYPES),
              maxCharacters: z.string().optional(),
              sampleImage: z.string().optional(),
            }),
          )
          .optional(),
        // SEO metadata
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        // Shipping
        packagingId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const {
        productId,
        name,
        description,
        categoryId,
        price,
        images,
        materials: inputMaterials,
        customizationOptions: inputCustomizationOptions,
        metaTitle,
        metaDescription,
        packagingId,
      } = input;

      // Build update object dynamically based on provided fields
      const updateData: Partial<typeof products.$inferInsert> = {};

      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (price !== undefined) updateData.price = price;
      if (metaTitle !== undefined)
        updateData.metaTitle = metaTitle || undefined;
      if (metaDescription !== undefined) {
        updateData.metaDescription = metaDescription || undefined;
      }
      if (packagingId !== undefined) {
        updateData.packagingId = packagingId || undefined;
      }
      if (images !== undefined) {
        updateData.images = images;
        updateData.primaryImage = images[0];
      }

      // Update the product if there are any fields to update
      let updatedProduct: typeof products.$inferSelect | undefined;
      if (Object.keys(updateData).length > 0) {
        [updatedProduct] = await db
          .update(products)
          .set(updateData)
          .where(eq(products.id, productId))
          .returning();
      }

      // Update materials if provided
      let updatedMaterials:
        | (typeof productMaterials.$inferSelect)[]
        | undefined;
      if (inputMaterials !== undefined) {
        // Get the product to use its slug for SKU generation
        const [product] = await db
          .select({ slug: products.slug })
          .from(products)
          .where(eq(products.id, productId));

        // Delete all existing materials for this product
        await db
          .delete(productMaterials)
          .where(eq(productMaterials.productId, productId));

        // Insert new materials
        if (inputMaterials.length > 0) {
          updatedMaterials = await db
            .insert(productMaterials)
            .values(
              inputMaterials.map((material, index) => ({
                productId,
                materialId: material.materialId,
                // Generate SKU: product-slug_material-index (e.g., "DN-001_MAT-1")
                sku: `${product.slug.toUpperCase()}_MAT-${index + 1}`,
                price: material.price,
                stockQuantity: parseInt(material.stockQuantity),
                lowStockThreshold: parseInt(material.lowStockThreshold),
                isDefault: material.isDefault,
              })),
            )
            .returning();
        }
      }

      // Update customization options if provided
      let updatedCustomizationOptions:
        | (typeof customizationOptions.$inferSelect)[]
        | undefined;
      if (inputCustomizationOptions !== undefined) {
        // Delete all existing customization options for this product
        await db
          .delete(customizationOptions)
          .where(eq(customizationOptions.productId, productId));

        // Insert new customization options
        if (inputCustomizationOptions.length > 0) {
          updatedCustomizationOptions = await db
            .insert(customizationOptions)
            .values(
              inputCustomizationOptions.map((option, index) => ({
                productId,
                name: option.name,
                description: option.description || undefined,
                type: option.type,
                maxCharacters: option.maxCharacters
                  ? parseInt(option.maxCharacters)
                  : undefined,
                sampleImage: option.sampleImage || undefined,
                displayOrder: index,
              })),
            )
            .returning();
        }
      }

      return {
        success: true,
        product: updatedProduct,
        materials: updatedMaterials,
        customizationOptions: updatedCustomizationOptions,
      };
    }),
});

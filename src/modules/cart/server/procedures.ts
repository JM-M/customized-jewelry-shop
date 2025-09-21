import { db } from "@/db";
import {
  cartItems,
  carts,
  materials,
  productMaterials,
  products,
} from "@/db/schema/products";
import { auth } from "@/lib/auth";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  eq,
  getTableColumns,
  inArray,
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";
import { headers } from "next/headers";
import { z } from "zod";

// Helper function to verify user authentication and cart ownership
async function verifyUserAndCart(cartId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access cart",
    });
  }

  // If cartId is provided, verify the cart belongs to the user
  if (cartId) {
    const [cart] = await db.select().from(carts).where(eq(carts.id, cartId));

    if (!cart) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Cart not found",
      });
    }

    if (cart.userId !== session.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You can only access your own cart",
      });
    }
  }

  return session.user.id;
}

// Helper function to verify cart item ownership
async function verifyCartItemOwnership(itemId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to modify cart items",
    });
  }

  // Get cart item with cart info to verify ownership
  const [cartItem] = await db
    .select({
      ...getTableColumns(cartItems),
      cart: getTableColumns(carts),
    })
    .from(cartItems)
    .innerJoin(carts, eq(cartItems.cartId, carts.id))
    .where(eq(cartItems.id, itemId))
    .limit(1);

  if (!cartItem) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Cart item not found",
    });
  }

  if (cartItem.cart.userId !== session.user.id) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You can only modify your own cart items",
    });
  }

  return session.user.id;
}

export const cartRouter = createTRPCRouter({
  // Get user's active cart
  getCart: baseProcedure.query(async () => {
    const userId = await verifyUserAndCart();

    const [cart] = await db
      .select(getTableColumns(carts))
      .from(carts)
      .where(and(eq(carts.userId, userId), eq(carts.status, "active")))
      .limit(1);

    if (!cart) {
      return null;
    }

    // Get cart items with related data
    const items = await db
      .select({
        ...getTableColumns(cartItems),
        product: getTableColumns(products),
        material: getTableColumns(materials),
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(materials, eq(cartItems.materialId, materials.id))
      .where(eq(cartItems.cartId, cart.id));

    // Get product materials for each product
    const productIds = [...new Set(items.map((item) => item.productId))];
    let productMaterialsData: (InferSelectModel<typeof productMaterials> & {
      material: InferSelectModel<typeof materials>;
    })[] = [];

    if (productIds.length > 0) {
      productMaterialsData = await db
        .select({
          ...getTableColumns(productMaterials),
          material: getTableColumns(materials),
        })
        .from(productMaterials)
        .innerJoin(materials, eq(productMaterials.materialId, materials.id))
        .where(
          productIds.length === 1
            ? eq(productMaterials.productId, productIds[0])
            : inArray(productMaterials.productId, productIds),
        );
    }

    // Combine the data
    const cartWithItems = {
      ...cart,
      items: items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          materials: productMaterialsData.filter(
            (pm) => pm.productId === item.productId,
          ),
        },
      })),
    };

    return cartWithItems;
  }),

  // Add item to cart
  addItem: baseProcedure
    .input(
      z.object({
        productId: z.string(),
        materialId: z.string().optional(),
        quantity: z.number().min(1).default(1),
        engravings: z
          .record(
            z.string(),
            z.object({
              type: z.enum(["text", "image", "qr_code"]),
              content: z.string(),
              additionalPrice: z.number().optional(),
            }),
          )
          .optional(),
        notes: z.string().optional(),
        itemId: z.string().optional(), // Allow client to specify the item ID for optimistic updates
      }),
    )
    .mutation(async ({ input }) => {
      const userId = await verifyUserAndCart();

      // Get or create cart
      let [cart] = await db
        .select()
        .from(carts)
        .where(and(eq(carts.userId, userId), eq(carts.status, "active")))
        .limit(1);

      if (!cart) {
        const [newCart] = await db
          .insert(carts)
          .values({
            userId: userId,
          })
          .returning();
        cart = newCart;
      }

      // Get product with material pricing
      const whereConditions = [eq(productMaterials.productId, input.productId)];
      if (input.materialId) {
        whereConditions.push(eq(productMaterials.materialId, input.materialId));
      }

      const [productMaterial] = await db
        .select({
          ...getTableColumns(productMaterials),
          product: getTableColumns(products),
          material: getTableColumns(materials),
        })
        .from(productMaterials)
        .innerJoin(products, eq(productMaterials.productId, products.id))
        .leftJoin(materials, eq(productMaterials.materialId, materials.id))
        .where(and(...whereConditions))
        .limit(1);

      if (!productMaterial) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product or material not found",
        });
      }

      const price = Number(productMaterial.price);

      // Check if item already exists in cart
      const existingItemConditions = [
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productId, input.productId),
      ];
      if (input.materialId) {
        existingItemConditions.push(eq(cartItems.materialId, input.materialId));
      }

      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(and(...existingItemConditions))
        .limit(1);

      if (existingItem) {
        // Update existing item
        const newQuantity = existingItem.quantity + input.quantity;

        const [updatedItem] = await db
          .update(cartItems)
          .set({
            quantity: newQuantity,
            engravings: input.engravings || existingItem.engravings,
            notes: input.notes || existingItem.notes,
            updatedAt: new Date(),
          })
          .where(eq(cartItems.id, existingItem.id))
          .returning();

        return updatedItem;
      } else {
        // Add new item
        const insertValues: InferInsertModel<typeof cartItems> = {
          cartId: cart.id,
          productId: input.productId,
          materialId: input.materialId,
          quantity: input.quantity,
          price: price.toString(),
          engravings: input.engravings || {},
          notes: input.notes,
        };

        // Use provided itemId if available (for optimistic updates)
        if (input.itemId) {
          insertValues.id = input.itemId;
        }

        const [newItem] = await db
          .insert(cartItems)
          .values(insertValues)
          .returning();

        return newItem;
      }
    }),

  // Update item quantity
  updateQuantity: baseProcedure
    .input(
      z.object({
        itemId: z.string(),
        quantity: z.number().min(0),
      }),
    )
    .mutation(async ({ input }) => {
      const userId = await verifyCartItemOwnership(input.itemId);

      if (input.quantity === 0) {
        // Remove item if quantity is 0
        await db.delete(cartItems).where(eq(cartItems.id, input.itemId));
        return null;
      }

      const [updatedItem] = await db
        .update(cartItems)
        .set({
          quantity: input.quantity,
          updatedAt: new Date(),
        })
        .where(eq(cartItems.id, input.itemId))
        .returning();

      return updatedItem;
    }),

  // Remove item from cart
  removeItem: baseProcedure
    .input(
      z.object({
        itemId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const userId = await verifyCartItemOwnership(input.itemId);

      await db.delete(cartItems).where(eq(cartItems.id, input.itemId));
      return { success: true };
    }),

  // Clear cart
  clearCart: baseProcedure
    .input(
      z.object({
        cartId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const userId = await verifyUserAndCart(input.cartId);

      await db.delete(cartItems).where(eq(cartItems.cartId, input.cartId));
      return { success: true };
    }),
});

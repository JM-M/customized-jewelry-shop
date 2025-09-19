import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  parentId: uuid("parent_id").references((): any => categories.id, {
    onDelete: "cascade",
  }),
  isActive: boolean("is_active")
    .$defaultFn(() => true)
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  // originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  sku: text("sku").unique(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "cascade",
  }),

  // // Product details
  // weight: decimal("weight", { precision: 8, scale: 2 }), // in grams
  // dimensions: json("dimensions").$type<{
  //   length?: number;
  //   width?: number;
  //   height?: number;
  //   unit?: string;
  // }>(),

  // Images
  primaryImage: text("primary_image").notNull(),
  images: json("images")
    .$type<string[]>()
    .$defaultFn(() => []),

  // // Availability
  // isActive: boolean("is_active")
  //   .$defaultFn(() => true)
  //   .notNull(),
  // isFeatured: boolean("is_featured")
  //   .$defaultFn(() => false)
  //   .notNull(),
  stockQuantity: integer("stock_quantity").$defaultFn(() => 0),
  // lowStockThreshold: integer("low_stock_threshold").$defaultFn(() => 10),

  // SEO
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),

  // Customization options
  // availableMaterials: json("available_materials")
  //   .$type<string[]>()
  //   .$defaultFn(() => ["Gold", "Silver", "Rose Gold"]),
  // allowsEngraving: boolean("allows_engraving")
  //   .$defaultFn(() => true)
  //   .notNull(),
  // engravingOptions: json("engraving_options")
  //   .$type<{
  //     front?: boolean;
  //     back?: boolean;
  //     inside?: boolean;
  //     maxLength?: number;
  //   }>()
  //   .$defaultFn(() => ({
  //     front: true,
  //     back: true,
  //     inside: true,
  //     maxLength: 20,
  //   })),

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Product reviews table
export const productReviews = pgTable("product_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }), // References user.id from auth schema
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  comment: text("comment"),
  // isVerified: boolean("is_verified")
  //   .$defaultFn(() => false)
  //   .notNull(),
  // isApproved: boolean("is_approved")
  //   .$defaultFn(() => true)
  //   .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// // Product materials enum (for reference)
// export const productMaterials = pgTable("product_materials", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   name: text("name").notNull().unique(),
//   hexColor: text("hex_color").notNull(),
//   createdAt: timestamp("created_at")
//     .$defaultFn(() => new Date())
//     .notNull(),
// });

// // Product variants (for different materials, sizes, etc.)
// export const productVariants = pgTable("product_variants", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   productId: uuid("product_id")
//     .references(() => products.id, { onDelete: "cascade" })
//     .notNull(),
//   name: text("name").notNull(), // e.g., "Gold", "Silver", "Large", "Small"
//   sku: text("sku").unique(),
//   price: decimal("price", { precision: 10, scale: 2 }),
//   stockQuantity: integer("stock_quantity").$defaultFn(() => 0),
//   attributes: json("attributes").$type<{
//     material?: string;
//     size?: string;
//     color?: string;
//     [key: string]: any;
//   }>(),
//   isActive: boolean("is_active")
//     .$defaultFn(() => true)
//     .notNull(),
//   createdAt: timestamp("created_at")
//     .$defaultFn(() => new Date())
//     .notNull(),
//   updatedAt: timestamp("updated_at")
//     .$defaultFn(() => new Date())
//     .notNull(),
// });

// Relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryParent",
  }),
  subcategories: many(categories, {
    relationName: "categoryParent",
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(productReviews),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(user, {
    fields: [productReviews.userId],
    references: [user.id],
  }),
}));

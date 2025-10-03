import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { pickupAddresses, terminalAddresses } from "./logistics";
import { transactions } from "./payments";
import { materials, products } from "./shop";

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

// Main orders table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(), // Human-readable order number
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  // Order totals
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default(
    "0",
  ),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

  // Status tracking
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentReference: text("payment_reference"), // Payment processor reference (Stripe, PayPal, etc.)

  // Address information
  deliveryAddressId: text("delivery_address_id").references(
    () => terminalAddresses.address_id,
  ),
  pickupAddressId: text("pickup_address_id").references(
    () => pickupAddresses.id,
  ),

  // Terminal integration
  shipmentId: text("shipment_id"), // Terminal shipment ID
  trackingNumber: text("tracking_number"),
  rateId: text("rate_id"), // Terminal rate ID used for delivery

  // // Metadata
  // notes: text("notes"), // Customer notes
  // internalNotes: text("internal_notes"), // Internal staff notes

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  materialId: uuid("material_id").references(() => materials.id, {
    onDelete: "cascade",
  }),

  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),

  // Customization data (snapshot at time of order)
  customizations: json("customizations").$type<{
    [customizationOptionId: string]: {
      name: string;
      type: "text" | "image" | "qr_code";
      content: string;
      additionalPrice?: number;
    };
  }>(),
  notes: text("notes"), // Special requests

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id],
  }),
  deliveryAddress: one(terminalAddresses, {
    fields: [orders.deliveryAddressId],
    references: [terminalAddresses.address_id],
  }),
  pickupAddress: one(pickupAddresses, {
    fields: [orders.pickupAddressId],
    references: [pickupAddresses.id],
  }),
  items: many(orderItems),
  transactions: many(transactions),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  material: one(materials, {
    fields: [orderItems.materialId],
    references: [materials.id],
  }),
}));

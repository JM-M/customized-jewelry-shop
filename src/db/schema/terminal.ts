// TODO: Rename this file to logistics.ts

import { relations } from "drizzle-orm";
import { boolean, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Terminal addresses table - matches TerminalAddress interface exactly
export const terminalAddresses = pgTable("terminal_addresses", {
  // Primary key - using Terminal's address_id as the primary identifier
  address_id: text("address_id").primaryKey(),

  // Basic address information
  city: text("city").notNull(),

  // Coordinates as JSON object
  coordinates: json("coordinates")
    .$type<{
      lat: number;
      lng: number;
    }>()
    .notNull(),

  country: text("country").notNull(),
  email: text("email"),
  first_name: text("first_name"),

  // Terminal's internal ID
  id: text("id").notNull().unique(),

  is_residential: boolean("is_residential").notNull().default(true),
  last_name: text("last_name"),
  line1: text("line1"),
  line2: text("line2"),

  // Optional metadata as JSON
  metadata: json("metadata").$type<Record<string, any>>(),

  name: text("name"),
  phone: text("phone"),
  state: text("state").notNull(),
  zip: text("zip"),

  // Timestamps as text to match Terminal's format
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
});

// User addresses junction table - associates users with their Terminal addresses
export const userTerminalAddresses = pgTable("user_terminal_addresses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // User reference
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  // Terminal address reference
  terminalAddressId: text("terminal_address_id")
    .references(() => terminalAddresses.address_id, { onDelete: "cascade" })
    .notNull(),

  // User-specific metadata
  nickname: text("nickname"), // e.g., "Home", "Office", "Mom's House"
  isDefault: boolean("is_default").default(false),

  // Sync tracking
  lastSyncedAt: timestamp("last_synced_at")
    .$defaultFn(() => new Date())
    .notNull(),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Pickup addresses table - references terminal addresses for pickup locations
export const pickupAddresses = pgTable("pickup_addresses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // Reference to terminal address
  terminalAddressId: text("terminal_address_id")
    .references(() => terminalAddresses.address_id, { onDelete: "cascade" })
    .notNull(),

  // Whether this is the default pickup address
  isDefault: boolean("is_default").default(false).notNull(),

  // Optional nickname for the pickup address
  nickname: text("nickname"),

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Relations
export const terminalAddressesRelations = relations(
  terminalAddresses,
  ({ many }) => ({
    userAssociations: many(userTerminalAddresses),
    pickupAddresses: many(pickupAddresses),
  }),
);

export const userTerminalAddressesRelations = relations(
  userTerminalAddresses,
  ({ one }) => ({
    user: one(user, {
      fields: [userTerminalAddresses.userId],
      references: [user.id],
    }),
    terminalAddress: one(terminalAddresses, {
      fields: [userTerminalAddresses.terminalAddressId],
      references: [terminalAddresses.address_id],
    }),
  }),
);

export const pickupAddressesRelations = relations(
  pickupAddresses,
  ({ one }) => ({
    terminalAddress: one(terminalAddresses, {
      fields: [pickupAddresses.terminalAddressId],
      references: [terminalAddresses.address_id],
    }),
  }),
);

// Checkout sessions table - tracks user's checkout flow and Terminal entity associations
export const checkoutSessions = pgTable("checkout_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // User reference
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  // Terminal entity references (only store IDs, fetch data from API when needed)
  parcelId: text("parcel_id"), // Terminal parcel ID
  shipmentId: text("shipment_id"), // Terminal shipment ID
  rateId: text("rate_id"), // Selected rate ID

  // Checkout flow state
  checkoutStep: text("checkout_step", {
    enum: [
      "address_selected",
      "parcel_created",
      "rates_generated",
      "rate_selected",
      "shipment_created",
      "payment_completed",
    ],
  }).notNull(),

  // Context data (store only what you need for UI/flow)
  selectedAddressId: text("selected_address_id"), // User's selected delivery address
  cartSnapshot: json("cart_snapshot").$type<{
    itemCount: number;
    totalValue: number;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
  }>(), // Snapshot of cart at checkout

  // Status tracking
  status: text("status", {
    enum: ["active", "completed", "cancelled", "abandoned"],
  })
    .default("active")
    .notNull(),

  // Optional order reference
  orderId: text("order_id"), // Link to your order system when payment completes

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Relations
export const checkoutSessionsRelations = relations(
  checkoutSessions,
  ({ one }) => ({
    user: one(user, {
      fields: [checkoutSessions.userId],
      references: [user.id],
    }),
  }),
);

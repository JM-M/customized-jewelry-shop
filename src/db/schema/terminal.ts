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

// Relations
export const terminalAddressesRelations = relations(
  terminalAddresses,
  ({ many }) => ({
    userAssociations: many(userTerminalAddresses),
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

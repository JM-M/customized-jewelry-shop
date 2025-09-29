import { relations } from "drizzle-orm";
import {
  decimal,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";

// Transactions table - tracks all payment transactions
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Payment processor references
  paystackTransactionId: integer("paystack_transaction_id").notNull().unique(),
  paymentReference: text("payment_reference").notNull().unique(),

  // Order relationship
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),

  // Transaction details
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // Amount in main currency
  amountInKobo: integer("amount_in_kobo").notNull(), // Amount in kobo (Paystack's format)
  currency: text("currency", { enum: ["NGN", "USD", "GHS", "ZAR", "KES"] })
    .notNull()
    .default("NGN"),

  // Status tracking
  status: text("status", {
    enum: [
      "pending",
      "success",
      "failed",
      "cancelled",
      "refunded",
      "partially_refunded",
    ],
  })
    .notNull()
    .default("pending"),

  // Payment method details
  channel: text("channel", {
    enum: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
  }),
  cardType: text("card_type", {
    enum: [
      "visa",
      "mastercard",
      "american express",
      "discover",
      "diners club",
      "jcb",
      "unionpay",
    ],
  }),
  bank: text("bank"),
  last4: text("last4"), // Last 4 digits of card

  // Fees and breakdown
  fees: decimal("fees", { precision: 10, scale: 2 }).default("0"),
  feesBreakdown: json("fees_breakdown").$type<
    {
      fee_type: string;
      fee_amount: number;
      fee_percentage: number;
      fee_description: string;
    }[]
  >(),

  // Customer information (snapshot at time of transaction)
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerName: text("customer_name"),

  // Gateway response
  gatewayResponse: text("gateway_response"),
  message: text("message"),

  // Metadata and context
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: json("metadata").$type<Record<string, any>>(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  // Timestamps
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  paidAt: timestamp("paid_at"),
  failedAt: timestamp("failed_at"),
  refundedAt: timestamp("refunded_at"),
});

// Relations
export const transactionsRelations = relations(transactions, ({ one }) => ({
  order: one(orders, {
    fields: [transactions.orderId],
    references: [orders.id],
  }),
}));

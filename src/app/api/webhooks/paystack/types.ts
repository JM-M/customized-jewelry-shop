/**
 * Paystack Webhook Types
 * Based on official Paystack documentation and actual webhook payloads
 */

// Base webhook event structure
export interface PaystackWebhookEvent {
  event: PaystackEventType;
  data: PaystackTransactionData;
}

// Supported event types
export type PaystackEventType =
  | "charge.success"
  | "charge.failed"
  | "refund.processed"
  | "transfer.success"
  | "transfer.failed"
  | "subscription.create"
  | "subscription.disable"
  | "invoice.create"
  | "invoice.payment_failed";

// Transaction status types
export type PaystackTransactionStatus =
  | "success"
  | "failed"
  | "pending"
  | "processing"
  | "abandoned"
  | "ongoing"
  | "queued"
  | "reversed";

// Payment channel types
export type PaystackChannel =
  | "card"
  | "bank"
  | "ussd"
  | "qr"
  | "mobile_money"
  | "bank_transfer";

// Card types
export type PaystackCardType =
  | "visa"
  | "mastercard"
  | "american express"
  | "discover"
  | "diners club"
  | "jcb"
  | "unionpay";

// Currency codes
export type PaystackCurrency = "NGN" | "USD" | "GHS" | "ZAR" | "KES";

// Main transaction data structure
export interface PaystackTransactionData {
  id: number;
  domain: "test" | "live";
  status: PaystackTransactionStatus;
  reference: string;
  amount: number; // Amount in kobo (smallest currency unit)
  message: string | null;
  gateway_response: string;
  paid_at: string; // ISO 8601 timestamp
  created_at: string; // ISO 8601 timestamp
  channel: PaystackChannel;
  currency: PaystackCurrency;
  ip_address: string;
  metadata: PaystackMetadata;
  fees_breakdown: PaystackFeesBreakdown | null;
  log: PaystackLog | null;
  fees: number; // Fees in kobo
  fees_split: PaystackFeesSplit | null;
  authorization: PaystackAuthorization;
  customer: PaystackCustomer;
  plan: PaystackPlan | {};
  subaccount: PaystackSubaccount | {};
  split: PaystackSplit | {};
  order_id: string | null;
  paidAt: string; // ISO 8601 timestamp (duplicate of paid_at)
  requested_amount: number; // Amount in kobo
  pos_transaction_data: PaystackPosTransactionData | null;
  source: PaystackSource;
}

// Authorization details
export interface PaystackAuthorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: PaystackChannel;
  card_type: PaystackCardType;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: string | null;
  receiver_bank_account_number: string | null;
  receiver_bank: string | null;
}

// Customer information
export interface PaystackCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  customer_code: string;
  phone: string;
  metadata: PaystackMetadata | null;
  risk_action: "default" | "allow" | "deny";
  international_format_phone: string | null;
}

// Metadata structure
export interface PaystackMetadata {
  referrer?: string;
  custom_fields?: PaystackCustomField[];
  [key: string]: any; // Allow additional custom fields
}

// Custom field structure
export interface PaystackCustomField {
  display_name: string;
  variable_name: string;
  value: string;
}

// Fees breakdown
export interface PaystackFeesBreakdown {
  fee_type: string;
  fee_amount: number;
  fee_percentage: number;
  fee_description: string;
}

// Fees split
export interface PaystackFeesSplit {
  [key: string]: number; // Dynamic split based on subaccounts
}

// Log structure
export interface PaystackLog {
  time_spent: number;
  attempts: number;
  authentication: string;
  errors: number;
  success: boolean;
  mobile: boolean;
  input: any[];
  channel: PaystackChannel;
  history: PaystackLogHistory[];
}

// Log history
export interface PaystackLogHistory {
  type: string;
  message: string;
  time: number;
}

// Plan information
export interface PaystackPlan {
  id: number;
  name: string;
  plan_code: string;
  description: string;
  amount: number;
  interval: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  send_invoices: boolean;
  send_sms: boolean;
  hosted_page: boolean;
  hosted_page_url: string | null;
  hosted_page_summary: string | null;
  currency: PaystackCurrency;
  migrate: boolean;
  amount_paid: number;
  next_payment_date: string;
  createdAt: string;
  updatedAt: string;
}

// Subaccount information
export interface PaystackSubaccount {
  id: number;
  subaccount_code: string;
  business_name: string;
  description: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  metadata: PaystackMetadata | null;
  percentage_charge: number;
  settlement_bank: string;
  account_number: string;
}

// Split information
export interface PaystackSplit {
  [key: string]: {
    subaccount: string;
    share: number;
  };
}

// POS transaction data
export interface PaystackPosTransactionData {
  time_spent: number;
  attempts: number;
  authentication: string;
  errors: number;
  success: boolean;
  mobile: boolean;
  input: any[];
  channel: PaystackChannel;
  history: PaystackLogHistory[];
}

// Source information
export interface PaystackSource {
  type: "web" | "mobile" | "api";
  source: "checkout" | "inline" | "api";
  entry_point: "request_inline" | "request_standard";
  identifier: string | null;
}

// Specific event data types
export interface PaystackChargeSuccessEvent extends PaystackWebhookEvent {
  event: "charge.success";
  data: PaystackTransactionData;
}

export interface PaystackChargeFailedEvent extends PaystackWebhookEvent {
  event: "charge.failed";
  data: PaystackTransactionData;
}

export interface PaystackRefundProcessedEvent extends PaystackWebhookEvent {
  event: "refund.processed";
  data: PaystackRefundData;
}

export interface PaystackTransferSuccessEvent extends PaystackWebhookEvent {
  event: "transfer.success";
  data: PaystackTransferData;
}

export interface PaystackTransferFailedEvent extends PaystackWebhookEvent {
  event: "transfer.failed";
  data: PaystackTransferData;
}

// Refund data structure
export interface PaystackRefundData {
  id: number;
  domain: "test" | "live";
  integration: number;
  transaction: number;
  amount: number;
  currency: PaystackCurrency;
  reason: string;
  status: "success" | "failed" | "pending";
  refunded_at: string;
  createdAt: string;
  updatedAt: string;
}

// Transfer data structure
export interface PaystackTransferData {
  id: number;
  domain: "test" | "live";
  amount: number;
  currency: PaystackCurrency;
  reference: string;
  source: string;
  source_details: any;
  destination: string;
  destination_details: any;
  transfer_code: string;
  status: "success" | "failed" | "pending";
  failures: any;
  titan_code: string | null;
  transferred_at: string | null;
  createdAt: string;
  updatedAt: string;
}

// Union type for all possible event data
export type PaystackEventData =
  | PaystackTransactionData
  | PaystackRefundData
  | PaystackTransferData;

// Type guards for runtime type checking
export function isChargeSuccessEvent(
  event: PaystackWebhookEvent,
): event is PaystackChargeSuccessEvent {
  return event.event === "charge.success";
}

export function isChargeFailedEvent(
  event: PaystackWebhookEvent,
): event is PaystackChargeFailedEvent {
  return event.event === "charge.failed";
}

export function isRefundProcessedEvent(
  event: PaystackWebhookEvent,
): event is PaystackRefundProcessedEvent {
  return event.event === "refund.processed";
}

export function isTransferSuccessEvent(
  event: PaystackWebhookEvent,
): event is PaystackTransferSuccessEvent {
  return event.event === "transfer.success";
}

export function isTransferFailedEvent(
  event: PaystackWebhookEvent,
): event is PaystackTransferFailedEvent {
  return event.event === "transfer.failed";
}

// Utility types for common operations
export type PaystackAmount = number; // Always in kobo
export type PaystackTimestamp = string; // ISO 8601 format
export type PaystackReference = string; // Payment reference

// Helper function to convert kobo to main currency
export function koboToCurrency(
  amount: PaystackAmount,
  currency: PaystackCurrency,
): number {
  const divisor = currency === "NGN" ? 100 : 100; // Most currencies use 100 as divisor
  return amount / divisor;
}

// Helper function to format currency
export function formatPaystackAmount(
  amount: PaystackAmount,
  currency: PaystackCurrency,
): string {
  const value = koboToCurrency(amount, currency);
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
  }).format(value);
}

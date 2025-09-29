import { db } from "@/db";
import { orders } from "@/db/schema/orders";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  PaystackChargeFailedEvent,
  PaystackChargeSuccessEvent,
  PaystackRefundProcessedEvent,
  PaystackWebhookEvent,
  isChargeFailedEvent,
  isChargeSuccessEvent,
  isRefundProcessedEvent,
  isTransferFailedEvent,
  isTransferSuccessEvent,
} from "./types";

// Paystack webhook IP addresses for security
const PAYSTACK_IPS = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];

// Verify the request is from Paystack
function verifyPaystackIP(request: NextRequest): boolean {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const clientIP = forwarded?.split(",")[0] || realIP || "unknown";

  return PAYSTACK_IPS.includes(clientIP);
}

// Verify Paystack signature
function verifyPaystackSignature(
  body: string,
  signature: string,
  secret: string,
): boolean {
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

  return hash === signature;
}

// Handle successful payment
async function handlePaymentSuccess(event: PaystackChargeSuccessEvent) {
  const { data } = event;
  const { reference, amount, customer, metadata } = data;

  console.log(`Processing successful payment for reference: ${reference}`);

  try {
    // Find the order by payment reference
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentReference, reference))
      .limit(1);

    if (!order) {
      console.error(`Order not found for payment reference: ${reference}`);
      return;
    }

    // Update order status to confirmed if it's still pending
    // This handles cases where the webhook is received after frontend order creation
    if (order.status === "pending") {
      await db
        .update(orders)
        .set({
          status: "confirmed",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      console.log(
        `Order ${order.orderNumber} confirmed for payment ${reference}`,
      );
    } else {
      console.log(
        `Order ${order.orderNumber} already confirmed for payment ${reference}`,
      );
    }

    // TODO: Send confirmation email to customer
    // TODO: Notify admin about new order
    // TODO: Trigger any post-payment workflows
  } catch (error) {
    console.error(`Error processing payment success for ${reference}:`, error);
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailure(event: PaystackChargeFailedEvent) {
  const { data } = event;
  const { reference, message } = data;

  console.log(
    `Processing failed payment for reference: ${reference}, reason: ${message}`,
  );

  try {
    // Find the order by payment reference
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentReference, reference))
      .limit(1);

    if (!order) {
      console.error(`Order not found for payment reference: ${reference}`);
      return;
    }

    // Update order status to cancelled if it's still pending
    if (order.status === "pending") {
      await db
        .update(orders)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      console.log(
        `Order ${order.orderNumber} cancelled due to payment failure`,
      );
    }

    // TODO: Send failure notification to customer
    // TODO: Notify admin about failed payment
  } catch (error) {
    console.error(`Error processing payment failure for ${reference}:`, error);
    throw error;
  }
}

// Handle refund events
async function handleRefund(event: PaystackRefundProcessedEvent) {
  const { data } = event;
  const { transaction, amount, reason } = data;

  console.log(
    `Processing refund for transaction: ${transaction}, amount: ${amount}, reason: ${reason}`,
  );

  try {
    // For refunds, we need to find the order by the transaction ID
    // Since refunds don't have a direct reference, we'll need to look up by transaction ID
    // This is a limitation - we might need to store transaction IDs in orders table
    console.log(`Refund processed for transaction ID: ${transaction}`);

    // TODO: Implement proper refund handling
    // This requires either:
    // 1. Storing transaction IDs in orders table, or
    // 2. Using Paystack API to get transaction details by ID

    console.log(`Refund of ${amount} processed for transaction ${transaction}`);

    // TODO: Send refund notification to customer
    // TODO: Notify admin about refund
  } catch (error) {
    console.error(
      `Error processing refund for transaction ${transaction}:`,
      error,
    );
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get Paystack secret key from environment
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    // Verify request is from Paystack IP (optional but recommended)
    if (process.env.NODE_ENV === "production" && !verifyPaystackIP(request)) {
      console.warn("Webhook request from unauthorized IP");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the raw body and signature
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      console.error("Missing Paystack signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify the signature
    if (!verifyPaystackSignature(body, signature, secret)) {
      console.error("Invalid Paystack signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the event data
    const event: PaystackWebhookEvent = JSON.parse(body);
    console.log(`Received Paystack webhook event: ${event.event}`);

    // Handle different event types with type safety
    if (isChargeSuccessEvent(event)) {
      await handlePaymentSuccess(event);
    } else if (isChargeFailedEvent(event)) {
      await handlePaymentFailure(event);
    } else if (isRefundProcessedEvent(event)) {
      await handleRefund(event);
    } else if (isTransferSuccessEvent(event)) {
      console.log("Transfer successful:", event.data);
      // Handle successful transfers if needed
    } else if (isTransferFailedEvent(event)) {
      console.log("Transfer failed:", event.data);
      // Handle failed transfers if needed
    } else {
      console.log(`Unhandled Paystack event type: ${event.event}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);

    // Return 500 to indicate processing error
    // Paystack will retry the webhook
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

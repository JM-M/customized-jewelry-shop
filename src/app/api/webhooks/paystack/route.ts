import { db } from "@/db";
import { orders } from "@/db/schema/orders";
import { transactions } from "@/db/schema/payments";
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

// Helper function to find order by reference
async function findOrderByReference(reference: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.paymentReference, reference))
    .limit(1);

  return order;
}

// Handle successful payment
async function handlePaymentSuccess(event: PaystackChargeSuccessEvent) {
  const { data } = event;
  const {
    id,
    reference,
    amount,
    customer,
    metadata,
    authorization,
    channel,
    currency,
    fees,
    fees_breakdown,
    gateway_response,
    message,
    ip_address,
    paid_at,
  } = data;

  console.log(`Processing successful payment for reference: ${reference}`);
  console.log(`Paystack transaction ID: ${id} (type: ${typeof id})`);
  console.log(`Amount: ${amount} kobo (${amount / 100} ${currency})`);
  console.log(`Customer: ${customer.email}`);

  let order: any = null;
  try {
    // Find the order by payment reference with retry logic
    [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentReference, reference))
      .limit(1);

    if (!order) {
      console.log(
        `Order not found for payment reference: ${reference}. Waiting for order creation...`,
      );

      // Wait a bit for the order to be created (race condition handling)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.paymentReference, reference))
        .limit(1);

      if (!order) {
        console.error(
          `Order still not found for payment reference: ${reference} after retry`,
        );
        console.error(`This indicates a serious issue with the payment flow.`);
        console.error(`Payment was successful but no order was created.`);
        return;
      }
    }

    // Create transaction record
    console.log(`Creating transaction record for order: ${order.id}`);
    console.log(`Transaction data:`, {
      paystackTransactionId: id,
      paymentReference: reference,
      orderId: order.id,
      amount: (amount / 100).toString(),
      amountInKobo: amount,
      currency: currency,
      status: "success",
      channel: channel,
      cardType: authorization.card_type,
      bank: authorization.bank,
      last4: authorization.last4,
      fees: (fees / 100).toString(),
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerName: `${customer.first_name} ${customer.last_name}`,
    });

    await db.insert(transactions).values({
      paystackTransactionId: id,
      paymentReference: reference,
      orderId: order.id,
      amount: (amount / 100).toString(), // Convert from kobo to main currency
      amountInKobo: amount,
      currency: currency,
      status: "success",
      channel: channel,
      cardType: authorization.card_type,
      bank: authorization.bank,
      last4: authorization.last4,
      fees: (fees / 100).toString(), // Convert from kobo to main currency
      feesBreakdown: fees_breakdown ? [fees_breakdown] : null,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerName: `${customer.first_name} ${customer.last_name}`,
      gatewayResponse: gateway_response,
      message: message,
      metadata: metadata,
      ipAddress: ip_address,
      paidAt: new Date(paid_at),
    });

    console.log(
      `Transaction record created successfully for reference: ${reference}`,
    );

    // Update order status to confirmed if it's still pending
    if (order.status === "pending") {
      console.log(
        `Updating order ${order.orderNumber} status from pending to confirmed`,
      );
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
    console.error(`Error details:`, {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      paystackTransactionId: id,
      paymentReference: reference,
      orderId: order?.id,
    });
    throw error;
  }
}

// Handle failed payment
async function handlePaymentFailure(event: PaystackChargeFailedEvent) {
  const { data } = event;
  const {
    id,
    reference,
    amount,
    customer,
    metadata,
    authorization,
    channel,
    currency,
    fees,
    gateway_response,
    message,
    ip_address,
  } = data;

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

    // Create transaction record for failed payment
    await db.insert(transactions).values({
      paystackTransactionId: id,
      paymentReference: reference,
      orderId: order.id,
      amount: (amount / 100).toString(), // Convert from kobo to main currency
      amountInKobo: amount,
      currency: currency,
      status: "failed",
      channel: channel,
      cardType: authorization?.card_type,
      bank: authorization?.bank,
      last4: authorization?.last4,
      fees: (fees / 100).toString(), // Convert from kobo to main currency
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerName: `${customer.first_name} ${customer.last_name}`,
      gatewayResponse: gateway_response,
      message: message,
      metadata: metadata,
      ipAddress: ip_address,
      failedAt: new Date(),
    });

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
  const {
    id,
    transaction,
    amount,
    reason,
    currency,
    status: refundStatus,
    refunded_at,
  } = data;

  console.log(
    `Processing refund for transaction: ${transaction}, amount: ${amount}, reason: ${reason}`,
  );

  try {
    // Find the original transaction by Paystack transaction ID
    const [originalTransaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.paystackTransactionId, transaction))
      .limit(1);

    if (!originalTransaction) {
      console.error(
        `Original transaction not found for Paystack ID: ${transaction}`,
      );
      return;
    }

    // Create a new transaction record for the refund
    await db.insert(transactions).values({
      paystackTransactionId: id, // Refund ID from Paystack
      paymentReference: `refund_${id}`, // Create a unique reference for refund
      orderId: originalTransaction.orderId,
      amount: (amount / 100).toString(), // Convert from kobo to main currency
      amountInKobo: amount,
      currency: currency,
      status: refundStatus === "success" ? "refunded" : "failed",
      channel: originalTransaction.channel, // Inherit from original transaction
      cardType: originalTransaction.cardType,
      bank: originalTransaction.bank,
      last4: originalTransaction.last4,
      customerEmail: originalTransaction.customerEmail,
      customerPhone: originalTransaction.customerPhone,
      customerName: originalTransaction.customerName,
      message: reason,
      metadata: {
        refund_reason: reason,
        original_transaction_id: transaction,
        refund_id: id,
      },
      refundedAt: new Date(refunded_at),
    });

    // Update the original transaction status if it was a full refund
    if (
      refundStatus === "success" &&
      amount === originalTransaction.amountInKobo
    ) {
      await db
        .update(transactions)
        .set({
          status: "refunded",
          updatedAt: new Date(),
        })
        .where(eq(transactions.id, originalTransaction.id));
    } else if (refundStatus === "success") {
      // Partial refund - update to partially_refunded
      await db
        .update(transactions)
        .set({
          status: "partially_refunded",
          updatedAt: new Date(),
        })
        .where(eq(transactions.id, originalTransaction.id));
    }

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
  console.log(
    `Received Paystack webhook request at ${new Date().toISOString()}`,
  );

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

    console.log(`Webhook body length: ${body.length} characters`);
    console.log(`Signature present: ${!!signature}`);

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
    console.log(`Event data:`, JSON.stringify(event.data, null, 2));

    // Handle different event types with type safety
    if (isChargeSuccessEvent(event)) {
      console.log(
        `Processing charge success event for reference: ${event.data.reference}`,
      );
      await handlePaymentSuccess(event);
    } else if (isChargeFailedEvent(event)) {
      console.log(
        `Processing charge failed event for reference: ${event.data.reference}`,
      );
      await handlePaymentFailure(event);
    } else if (isRefundProcessedEvent(event)) {
      console.log(
        `Processing refund event for transaction: ${event.data.transaction}`,
      );
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

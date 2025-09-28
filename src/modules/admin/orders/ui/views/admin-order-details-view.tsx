"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { Spinner2 } from "@/components/shared/spinner-2";

import { useParams } from "next/navigation";
import { AdminOrderActions } from "../components/admin-order-actions";
import { AdminOrderCustomerInfo } from "../components/admin-order-customer-info";
import { AdminOrderItems } from "../components/admin-order-items";
import { AdminOrderOverview } from "../components/admin-order-overview";
import { AdminOrderShippingInfo } from "../components/admin-order-shipping-info";

interface AdminOrderDetailsViewProps {
  orderNumber: string;
}

// Mock data for demonstration - replace with actual API call
const mockOrder = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  orderNumber: "ORD-123456-ABC123",
  status: "processing" as const,
  subtotal: "25000.00",
  deliveryFee: "1500.00",
  totalAmount: "26500.00",
  paymentReference: "pay_1234567890",
  trackingNumber: "TRK789456123",
  shipmentId: "ship_abc123",
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T14:45:00Z",
  shippedAt: null,
  deliveredAt: null,
  deliveryAddressId: "addr_123",
  pickupAddressId: null,
  // Customer info
  customer: {
    id: "user_123",
    name: "John Doe",
    email: "john.doe@example.com",
  },
  // Order items
  items: [
    {
      id: "item_1",
      productId: "prod_1",
      materialId: "mat_gold",
      quantity: 1,
      unitPrice: "25000.00",
      totalPrice: "25000.00",
      engravings: {
        front: {
          type: "text" as const,
          content: "Forever Love",
          additionalPrice: 2000,
        },
      },
      notes: "Please ensure high quality finish",
    },
  ],
};

export const AdminOrderDetailsView = () => {
  const { orderNumber } = useParams();

  // TODO: Replace with actual data fetching
  const isLoading = false;
  const order = mockOrder;

  if (isLoading) {
    return (
      <div>
        <AdminPageHeader
          title={`Order ${orderNumber}`}
          description="View and manage order details."
        />
        <div className="mt-6 flex items-center justify-center gap-2">
          <Spinner2 /> Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <AdminPageHeader
          title={`Order ${orderNumber}`}
          description="View and manage order details."
        />
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Order ${order.orderNumber}`}
        description="View and manage order details."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Overview */}
          <AdminOrderOverview order={order} />

          {/* Customer Information */}
          <AdminOrderCustomerInfo customer={order.customer} />

          {/* Order Items */}
          <AdminOrderItems items={order.items} />

          {/* Shipping Information */}
          <AdminOrderShippingInfo
            order={{
              deliveryAddressId: order.deliveryAddressId,
              pickupAddressId: order.pickupAddressId || undefined,
              trackingNumber: order.trackingNumber,
              shipmentId: order.shipmentId,
              shippedAt: order.shippedAt || undefined,
              deliveredAt: order.deliveredAt || undefined,
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin Actions */}
          <AdminOrderActions order={order} />
        </div>
      </div>
    </div>
  );
};

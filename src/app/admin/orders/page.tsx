import { AdminOrdersView } from "@/modules/admin/orders/ui/views/admin-orders-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
  description:
    "View and manage customer orders, track fulfillment status, and process payments",
};

const OrdersPage = () => {
  return <AdminOrdersView />;
};
export default OrdersPage;

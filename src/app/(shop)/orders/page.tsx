import { OrdersView } from "@/modules/orders/ui/views/orders-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your jewelry orders and purchase history",
  robots: {
    index: false,
    follow: false,
  },
};

const OrdersPage = () => {
  return <OrdersView />;
};
export default OrdersPage;

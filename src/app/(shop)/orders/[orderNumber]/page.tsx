import { OrderView } from "@/modules/orders/ui/views/order-view";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}): Promise<Metadata> {
  const { orderNumber } = await params;

  return {
    title: `Order #${orderNumber}`,
    description: `View details and track your order #${orderNumber}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const OrderPage = () => {
  return <OrderView />;
};
export default OrderPage;

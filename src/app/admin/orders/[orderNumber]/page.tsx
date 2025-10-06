import { AdminOrderDetailsView } from "@/modules/admin/orders/ui/views/admin-order-details-view";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}): Promise<Metadata> {
  const { orderNumber } = await params;

  return {
    title: `Order #${orderNumber}`,
    description: `Manage and process order #${orderNumber}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

const AdminOrderDetailsPage = () => {
  return <AdminOrderDetailsView />;
};

export default AdminOrderDetailsPage;

import { AdminCustomersView } from "@/modules/admin/customers/ui/views/admin-customers-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
  description: "View and manage customer information and order history",
};

const AdminCustomersPage = () => {
  return <AdminCustomersView />;
};

export default AdminCustomersPage;

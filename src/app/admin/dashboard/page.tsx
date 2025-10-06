import { AdminDashboardView } from "@/modules/admin/dashboard/ui/views/admin-dashboard-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Overview of your jewelry store performance, sales, and key metrics",
};

const AdminDashboardPage = () => {
  return <AdminDashboardView />;
};

export default AdminDashboardPage;

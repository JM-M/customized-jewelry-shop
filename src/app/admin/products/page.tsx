import { AdminProductsView } from "@/modules/admin/products/ui/views/admin-products-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Manage your jewelry inventory, add new products, and update existing items",
};

const AdminProductsPage = () => {
  return <AdminProductsView />;
};

export default AdminProductsPage;

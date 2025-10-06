import { AdminCategoriesView } from "@/modules/admin/categories/ui/views/admin-categories-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage jewelry categories and organize your product catalog",
};

const AdminCategoriesPage = () => {
  return <AdminCategoriesView />;
};
export default AdminCategoriesPage;

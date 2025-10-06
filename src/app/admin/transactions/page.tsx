import { AdminTransactionsView } from "@/modules/admin/transactions/ui/views/admin-transactions-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description: "Monitor payment transactions and financial records",
};

const AdminTransactionsPage = () => {
  return <AdminTransactionsView />;
};

export default AdminTransactionsPage;

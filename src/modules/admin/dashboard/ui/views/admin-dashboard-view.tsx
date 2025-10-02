"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { authClient } from "@/lib/auth-client";
import { LowStockProducts } from "../components/low-stock-products";
import { OrdersCard } from "../components/orders-card";
import { QuickActions } from "../components/quick-actions";
import { RecentOrders } from "../components/recent-orders";
import { RevenueCard } from "../components/revenue-card";

export const AdminDashboardView = () => {
  const { data: session } = authClient.useSession();
  const firstName = session?.user?.firstName;

  return (
    <div>
      <AdminPageHeader title={`Hello, ${firstName} 👋`} />

      <div className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 min-[860px]:grid-cols-2">
          <div className="space-y-4">
            <div>
              <RevenueCard />
            </div>
            <div>
              <LowStockProducts />
            </div>
          </div>
          <div>
            <OrdersCard />
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <QuickActions />
          </div>
          <div>
            <RecentOrders />
          </div>
        </div>
      </div>
    </div>
  );
};

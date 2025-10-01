// Analytics module types

export interface DateRange {
  from: Date;
  to: Date;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
}

export interface OrdersMetrics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageProcessingTime: number;
}

export interface CustomersMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerRetentionRate: number;
}

export interface ProductsMetrics {
  totalProducts: number;
  activeProducts: number;
  topSellingProducts: number;
  lowStockProducts: number;
}

export interface InventoryMetrics {
  totalStockValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  stockTurnoverRate: number;
}

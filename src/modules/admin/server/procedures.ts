import { createTRPCRouter } from "@/trpc/init";
import { adminCategoriesRouter } from "../categories/server/procedures";
import { adminOrdersRouter } from "../orders/server/procedures";
import { adminPackagingRouter } from "../packaging/server/procedures";
import { adminPickupAddressesRouter } from "../pickup-addresses/server/procedures";
import { adminProductsRouter } from "../products/server/procedures";

// Create a nested admin router that combines all admin modules
export const adminRouter = createTRPCRouter({
  products: adminProductsRouter,
  categories: adminCategoriesRouter,
  orders: adminOrdersRouter,
  pickupAddresses: adminPickupAddressesRouter,
  packaging: adminPackagingRouter,
});

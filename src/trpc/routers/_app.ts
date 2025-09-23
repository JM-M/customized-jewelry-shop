import { adminProductsRouter } from "@/modules/admin/admin-products/server/procedures";
import { cartRouter } from "@/modules/cart/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { checkoutRouter } from "@/modules/checkout/server/procedures";
import { homeRouter } from "@/modules/home/server/procedures";
import { ordersRouter } from "@/modules/orders/server/procedures";
import { productsRouter } from "@/modules/products/server/procedures";
import { terminalRouter } from "@/modules/terminal/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  home: homeRouter,
  products: productsRouter,
  cart: cartRouter,
  checkout: checkoutRouter,
  orders: ordersRouter,
  terminal: terminalRouter,
  adminProducts: adminProductsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

import { categoriesRouter } from "@/modules/categories/server/procedures";
import { productsProcedure } from "@/modules/products/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  products: productsProcedure,
});
// export type definition of API
export type AppRouter = typeof appRouter;

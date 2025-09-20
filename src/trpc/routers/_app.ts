import { categoriesRouter } from "@/modules/categories/server/procedures";
import { homeRouter } from "@/modules/home/server/procedures";
import { productsProcedure } from "@/modules/products/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  home: homeRouter,
  products: productsProcedure,
});
// export type definition of API
export type AppRouter = typeof appRouter;

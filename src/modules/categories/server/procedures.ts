import { db } from "@/db";
import { categories } from "@/db/schema/products";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const categoriesRouter = createTRPCRouter({
  getAll: baseProcedure.query(async ({ ctx }) => {
    const allCategories = await db.select().from(categories);

    if (!allCategories)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Categories not found",
      });
    return allCategories;
  }),
});

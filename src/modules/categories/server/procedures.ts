import { db } from "@/db";
import { categories } from "@/db/schema/shop";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { isNull } from "drizzle-orm";

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
  getParentCategories: baseProcedure.query(async ({ ctx }) => {
    const parentCategories = await db
      .select()
      .from(categories)
      .where(isNull(categories.parentId));

    if (!parentCategories)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Parent categories not found",
      });
    return parentCategories;
  }),
});

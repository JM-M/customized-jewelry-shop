"use client";

import { Spinner2 } from "@/components/shared/spinner-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { AdminProductsTable } from "@/modules/admin/products/ui/components/admin-products-table";

interface CategoryProductsSectionProps {
  categorySlug: string;
  includeSubcategories?: boolean;
}

export const CategoryProductsSection = ({
  categorySlug,
  includeSubcategories = true,
}: CategoryProductsSectionProps) => {
  const trpc = useTRPC();

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.categories.getProductsWithSubcategories.queryOptions({
      categorySlug,
      cursor: 0,
      limit: 20,
      includeSubcategories,
    }),
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 py-8">
            <Spinner2 />
            Loading products...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 py-8 text-red-600">
            Error loading products: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const products = productsData?.items || [];

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Products</CardTitle>
            <p className="text-muted-foreground text-sm">
              {productsData?.totalCount || 0} products in this category
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {products.length > 0 ? (
          <AdminProductsTable
            data={products}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <div className="py-8 text-center">
            <div className="text-muted-foreground mx-auto mb-4 h-12 w-12">
              📦
            </div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              No products found
            </h3>
            <p className="text-muted-foreground text-sm">
              This category doesn't have any products yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon } from "lucide-react";

import { useAdminProduct } from "../../contexts/admin-product";

export const AdminProductSEO = () => {
  const { product } = useAdminProduct();

  if (!product) {
    return null;
  }
  if (!product.metaTitle && !product.metaDescription) {
    return null;
  }

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">SEO Information</CardTitle>
        <Button variant="ghost">
          <EditIcon className="h-4 w-4" /> Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        {product.metaTitle && (
          <div>
            <span className="text-sm font-medium">Meta Title:</span>
            <div className="text-muted-foreground text-sm">
              {product.metaTitle}
            </div>
          </div>
        )}
        {product.metaDescription && (
          <div>
            <span className="text-sm font-medium">Meta Description:</span>
            <div className="text-muted-foreground text-sm">
              {product.metaDescription}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

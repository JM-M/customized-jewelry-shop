"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { GetProductByIdOutput } from "@/modules/products/types";
import { EditIcon } from "lucide-react";

interface AdminProductInfoProps {
  product: GetProductByIdOutput;
}

export const AdminProductInfo = ({ product }: AdminProductInfoProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">Product Information</CardTitle>
        <Button variant="ghost">
          <EditIcon className="h-4 w-4" /> Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Price:</span>
            <div className="text-primary text-lg font-semibold">
              {formatNaira(Number(product.price))}
            </div>
          </div>
          {product.sku && (
            <div>
              <span className="font-medium">SKU:</span>
              <div className="text-muted-foreground">{product.sku}</div>
            </div>
          )}
          <div>
            <span className="font-medium">Stock:</span>
            <div className="text-muted-foreground">
              {product.stockQuantity} available
            </div>
          </div>
          <div>
            <span className="font-medium">Created:</span>
            <div className="text-muted-foreground">
              {new Date(product.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

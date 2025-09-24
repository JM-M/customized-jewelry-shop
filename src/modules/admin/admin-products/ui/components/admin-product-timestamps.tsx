"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetProductByIdOutput } from "@/modules/products/types";

interface AdminProductTimestampsProps {
  product: GetProductByIdOutput;
}

export const AdminProductTimestamps = ({
  product,
}: AdminProductTimestampsProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">Timestamps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-0 text-sm">
        <div>
          <span className="font-medium">Created:</span>
          <div className="text-muted-foreground">
            {new Date(product.createdAt).toLocaleString()}
          </div>
        </div>
        <div>
          <span className="font-medium">Last Updated:</span>
          <div className="text-muted-foreground">
            {new Date(product.updatedAt).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

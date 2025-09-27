"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon } from "lucide-react";

import { useAdminProduct } from "../../contexts/admin-product";

export const AdminProductDescription = () => {
  const { product } = useAdminProduct();

  if (!product) {
    return null;
  }
  if (!product.description) {
    return null;
  }

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">Description</CardTitle>
        <Button variant="ghost">
          <EditIcon className="h-4 w-4" /> Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <p className="text-muted-foreground whitespace-pre-wrap">
          {product.description}
        </p>
      </CardContent>
    </Card>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetProductByIdOutput } from "@/modules/products/types";
import { EditIcon } from "lucide-react";

interface AdminProductCustomizationProps {
  product: GetProductByIdOutput;
}

export const AdminProductCustomization = ({
  product,
}: AdminProductCustomizationProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">Customization Options</CardTitle>
        <Button variant="ghost">
          <EditIcon className="h-4 w-4" /> Manage
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <div className="text-muted-foreground py-8 text-center">
          <p>No customization options configured yet.</p>
          <p className="mt-2 text-sm">
            Add materials, engraving areas, and other customization options to
            allow customers to personalize this product.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

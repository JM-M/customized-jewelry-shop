"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetProductByIdOutput } from "@/modules/products/types";
import { EditIcon } from "lucide-react";

interface AdminProductReviewsProps {
  product: GetProductByIdOutput;
}

export const AdminProductReviews = ({ product }: AdminProductReviewsProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="flex items-center justify-between p-0">
        <CardTitle className="font-medium">Product Reviews</CardTitle>
        <Button variant="ghost">
          <EditIcon className="h-4 w-4" /> Manage
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <div className="text-muted-foreground py-8 text-center">
          <p>No reviews available yet.</p>
          <p className="mt-2 text-sm">
            Reviews will be displayed here once customers start leaving
            feedback.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { ExternalLink, XIcon } from "lucide-react";
import Image from "next/image";

interface AdminOrderItemsProps {
  items: Array<{
    id: string;
    productId: string;
    materialId?: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    engravings?: {
      [engravingAreaId: string]: {
        type: "text" | "image" | "qr_code";
        content: string;
        additionalPrice?: number;
      };
    };
    notes?: string;
  }>;
}

export const AdminOrderItems = ({ items }: AdminOrderItemsProps) => {
  return (
    <Card className="gap-3 p-3">
      <CardHeader className="px-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Order Items ({items.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 px-0">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-gray-200 p-3">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="relative aspect-[6/7] h-24 w-20 flex-shrink-0">
                <Image
                  src="/images/sample-product/1.jpg" // Placeholder - will be replaced with actual product image
                  alt="Product"
                  fill
                  className="rounded-md object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-3">
                {/* Product Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        Custom Gold Ring
                        {/* Placeholder - will be replaced with actual product name */}
                      </h3>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ExternalLink className="size-3" />
                      </Button>
                    </div>

                    <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                      <span>SKU: RING-001</span>
                      <span>Product ID: {item.productId}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNaira(Number(item.totalPrice))}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {formatNaira(Number(item.unitPrice))} each
                    </p>
                  </div>
                </div>

                {/* Quantity and Material */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <XIcon className="size-3" strokeWidth={1.2} />
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                  {item.materialId && (
                    <Badge variant="outline" className="text-xs">
                      Gold
                      {/* Placeholder - will be replaced with actual material name */}
                    </Badge>
                  )}
                </div>

                {/* Engravings */}
                {item.engravings && Object.keys(item.engravings).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      Customizations:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(item.engravings).map(
                        ([areaId, engraving]) => (
                          <div
                            key={areaId}
                            className="rounded-md bg-gray-50 p-3"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      engraving.type === "text"
                                        ? "default"
                                        : engraving.type === "image"
                                          ? "secondary"
                                          : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {engraving.type.toUpperCase()}
                                  </Badge>
                                  <span className="text-sm font-medium text-gray-900">
                                    {areaId}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">
                                  {engraving.content}
                                </p>
                              </div>
                              {engraving.additionalPrice && (
                                <div className="text-right">
                                  <p className="text-sm font-medium text-green-600">
                                    +{formatNaira(engraving.additionalPrice)}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Special Notes */}
                {item.notes && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      Special Instructions:
                    </h4>
                    <p className="text-sm text-gray-700 italic">
                      "{item.notes}"
                    </p>
                  </div>
                )}

                {/* Item ID */}
                <div className="border-t pt-2">
                  <p className="text-muted-foreground text-xs">
                    Item ID: {item.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Order Items Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-sm font-medium">
            <span>Total Items:</span>
            <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Customization Fees:</span>
            <span>
              {formatNaira(
                items.reduce((sum, item) => {
                  if (item.engravings) {
                    return (
                      sum +
                      Object.values(item.engravings).reduce(
                        (engravingSum, engraving) =>
                          engravingSum +
                          (engraving.additionalPrice || 0) * item.quantity,
                        0,
                      )
                    );
                  }
                  return sum;
                }, 0),
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

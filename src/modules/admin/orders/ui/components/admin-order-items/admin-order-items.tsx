"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { XIcon } from "lucide-react";
import Image from "next/image";

import { AdminOrderItem } from "../../../types";

interface AdminOrderItemsProps {
  items: AdminOrderItem[];
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
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              {/* Product Image and Basic Info */}
              <div className="flex gap-3">
                <div className="relative aspect-square h-20 w-20 flex-shrink-0">
                  <Image
                    src={
                      item.product?.primaryImage ||
                      "/images/sample-product/1.jpg"
                    }
                    alt={item.product?.name || "Product"}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-gray-900">
                    {item.product?.name || "Unknown Product"}
                  </h3>
                  <div className="mt-1 space-y-1">
                    <div className="@min-[500px]:flex @min-[500px]:items-center @min-[500px]:gap-4">
                      <p className="text-muted-foreground text-sm">
                        <span className="@min-[500px]:hidden">SKU: </span>
                        <span className="hidden @min-[500px]:inline">
                          SKU:{" "}
                        </span>
                        {item.product?.sku || "N/A"}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        <span className="@min-[500px]:hidden">Qty: </span>
                        <span className="hidden @min-[500px]:inline">
                          Qty:{" "}
                        </span>
                        {item.quantity}
                      </p>
                    </div>
                    {item.material && (
                      <Badge variant="outline" className="text-xs">
                        {item.material.displayName || item.material.name}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="hidden text-right @min-[500px]:block">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNaira(Number(item.totalPrice))}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatNaira(Number(item.unitPrice))} each
                  </p>
                </div>
              </div>

              {/* Price section below image for screens < 500px */}
              <div className="flex justify-end gap-3 @min-[500px]:hidden">
                <div className="text-right text-nowrap">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNaira(Number(item.totalPrice))}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatNaira(Number(item.unitPrice))} each
                  </p>
                </div>
              </div>

              {/* Product Details - Mobile */}
              <div className="hidden space-y-3 @min-[500px]:block">
                {/* Customizations - Mobile */}
                {item.customizations &&
                  Object.keys(item.customizations).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Customizations:
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(item.customizations).map(
                          ([optionId, customization]) => (
                            <div
                              key={optionId}
                              className="rounded-md bg-gray-50 p-3"
                            >
                              <div className="space-y-2 min-[500px]:flex min-[500px]:items-start min-[500px]:justify-between min-[500px]:space-y-0">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        customization.type === "text"
                                          ? "default"
                                          : customization.type === "image"
                                            ? "secondary"
                                            : "outline"
                                      }
                                      className="text-xs"
                                    >
                                      {customization.type.toUpperCase()}
                                    </Badge>
                                    <span className="text-sm font-medium text-gray-900">
                                      {customization.name}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 min-[500px]:mt-1">
                                    {customization.content}
                                  </p>
                                </div>
                                {customization.additionalPrice && (
                                  <div className="min-[500px]:flex-shrink-0 min-[500px]:text-right">
                                    <p className="text-sm font-medium text-green-600">
                                      +
                                      {formatNaira(
                                        customization.additionalPrice,
                                      )}
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

                {/* Special Notes - Mobile */}
                {item.notes && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      Special Instructions:
                    </h4>
                    <p className="text-sm text-gray-700 italic">
                      {'"'}
                      {item.notes}
                      {'"'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden gap-4 sm:flex">
              {/* Product Image */}
              <div className="relative aspect-[6/7] h-24 w-20 flex-shrink-0">
                <Image
                  src={
                    item.product?.primaryImage || "/images/sample-product/1.jpg"
                  }
                  alt={item.product?.name || "Product"}
                  fill
                  className="rounded-md object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-3">
                {/* Product Header */}
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-medium text-gray-900">
                        {item.product?.name || "Unknown Product"}
                      </h3>
                    </div>

                    <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-4 text-sm">
                      <span>SKU: {item.product?.sku || "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
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
                  {item.material && (
                    <Badge variant="outline" className="text-xs">
                      {item.material.displayName || item.material.name}
                    </Badge>
                  )}
                </div>

                {/* Customizations */}
                {item.customizations &&
                  Object.keys(item.customizations).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Customizations:
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(item.customizations).map(
                          ([optionId, customization]) => (
                            <div
                              key={optionId}
                              className="rounded-md bg-gray-50 p-3"
                            >
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        customization.type === "text"
                                          ? "default"
                                          : customization.type === "image"
                                            ? "secondary"
                                            : "outline"
                                      }
                                      className="text-xs"
                                    >
                                      {customization.type.toUpperCase()}
                                    </Badge>
                                    <span className="text-sm font-medium text-gray-900">
                                      {customization.name}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm break-words text-gray-700">
                                    {customization.content}
                                  </p>
                                </div>
                                {customization.additionalPrice && (
                                  <div className="ml-2 flex-shrink-0 text-right">
                                    <p className="text-sm font-medium text-green-600">
                                      +
                                      {formatNaira(
                                        customization.additionalPrice,
                                      )}
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
                    <p className="text-sm break-words text-gray-700 italic">
                      {'"'}
                      {item.notes}
                      {'"'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Order Items Summary */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
            <div className="flex items-center justify-start gap-2 text-sm font-medium">
              <span>Total Items:</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex items-center justify-start gap-2 text-sm font-medium">
              <span>Customization Fees:</span>
              <span>
                {formatNaira(
                  items.reduce((sum, item) => {
                    if (item.customizations) {
                      return (
                        sum +
                        Object.values(item.customizations).reduce(
                          (customizationSum, customization) =>
                            customizationSum +
                            (customization.additionalPrice || 0) *
                              item.quantity,
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
        </div>
      </CardContent>
    </Card>
  );
};

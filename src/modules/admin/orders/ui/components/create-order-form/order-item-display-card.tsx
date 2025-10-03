"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { EditIcon, TrashIcon } from "lucide-react";

import { formatNaira } from "@/lib/utils";
import { CartCustomization } from "@/modules/products/types";
import { useTRPC } from "@/trpc/client";

import { OrderItemsFormValues } from "./schemas";

type OrderItem = OrderItemsFormValues["items"][0];

interface OrderItemDisplayCardProps {
  item: OrderItem;
  index: number;
  canRemove: boolean;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

const OrderItemDisplayCardSkeleton = ({
  canRemove,
}: {
  canRemove: boolean;
}) => {
  return (
    <Card className="w-full gap-3 p-3 transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="p-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            {canRemove && <Skeleton className="h-8 w-8 rounded" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3">
          {/* Customizations skeleton */}
          <div>
            <Skeleton className="mb-2 h-4 w-24" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          {/* Notes skeleton */}
          <div>
            <Skeleton className="mb-1 h-4 w-16" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Subtotal skeleton */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const OrderItemDisplayCard = ({
  item,
  index,
  canRemove,
  onEdit,
  onRemove,
}: OrderItemDisplayCardProps) => {
  const trpc = useTRPC();

  // Only fetch product details if we don't have the product name stored
  const { data: product, isLoading: isProductLoading } = useQuery(
    trpc.products.getById.queryOptions(
      {
        id: item.productId,
      },
      {
        enabled: !!item.productId && !item.productName, // Only fetch if no product name stored
      },
    ),
  );

  // Get customization options to display customization details
  const { data: customizationOptions, isLoading: isCustomizationLoading } =
    useQuery(
      trpc.products.getProductCustomizationOptions.queryOptions(
        {
          productId: item.productId,
        },
        {
          enabled: !!item.productId,
        },
      ),
    );

  // Get product materials to display material information
  const { data: productMaterials, isLoading: isMaterialsLoading } = useQuery(
    trpc.products.getProductMaterials.queryOptions(
      {
        productId: item.productId,
      },
      {
        enabled: !!item.productId,
      },
    ),
  );

  const getSelectedMaterial = () => {
    if (!productMaterials || !item.materialId) return null;
    const productMaterial = productMaterials.find(
      (pm) => pm.material.id === item.materialId,
    );
    return productMaterial?.material || null;
  };

  const formatCustomizationContent = (
    customizations: Record<string, CartCustomization>,
  ) => {
    if (Object.keys(customizations).length === 0) {
      return "No customizations";
    }

    return Object.entries(customizations).map(([optionId, customization]) => {
      let displayValue = "";
      switch (customization.type) {
        case "text":
          displayValue = customization.content;
          break;
        case "image":
          displayValue = "Image uploaded";
          break;
        case "qr_code":
          displayValue = "QR code generated";
          break;
        default:
          displayValue = "Custom content";
      }

      return (
        <div key={optionId} className="text-sm">
          <span className="font-medium">{customization.name}:</span>{" "}
          <span className="text-muted-foreground">{displayValue}</span>
        </div>
      );
    });
  };

  const subtotal = item.quantity * item.unitPrice;

  // Show skeleton while loading product or customization data (only if we don't have product name)
  if ((isProductLoading || isCustomizationLoading || isMaterialsLoading) && !item.productName) {
    return <OrderItemDisplayCardSkeleton canRemove={canRemove} />;
  }

  // Use stored product name or fallback to fetched product name
  const productName = item.productName || product?.name || "Unknown Product";

  return (
    <Card className="w-full gap-3 p-3 transition-shadow duration-200 hover:shadow-md">
      <CardHeader className="p-0">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{productName}</CardTitle>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>Qty: {item.quantity}</span>
              <span>•</span>
              <span>{formatNaira(item.unitPrice)} each</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item.id)}
              className="h-8 w-8 p-0 transition-colors duration-200"
            >
              <EditIcon className="h-4 w-4" />
            </Button>
            {canRemove && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="text-destructive hover:text-destructive h-8 w-8 p-0 transition-colors duration-200"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3">
          {/* Material */}
          {getSelectedMaterial() && (
            <div>
              <div className="mb-2 text-sm font-medium">Material:</div>
              <div className="flex items-center gap-2">
                <div
                  className="size-4 rounded-full border border-white/20"
                  style={{ backgroundColor: getSelectedMaterial()?.hexColor }}
                />
                <span className="text-sm text-muted-foreground">
                  {getSelectedMaterial()?.name
                    .replaceAll("_", " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              </div>
            </div>
          )}

          {/* Customizations */}
          <div>
            <div className="mb-2 text-sm font-medium">Customizations:</div>
            <div className="space-y-1">
              {formatCustomizationContent(item.customizations || {})}
            </div>
          </div>

          {/* Notes */}
          {item.notes && (
            <div>
              <div className="mb-1 text-sm font-medium">Notes:</div>
              <p className="text-muted-foreground text-sm">{item.notes}</p>
            </div>
          )}

          {/* Subtotal */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Subtotal:</span>
              <Badge variant="secondary" className="text-base">
                {formatNaira(subtotal)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

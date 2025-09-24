import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { GetUserOrderOutput } from "@/modules/orders/types";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface OrderItemsListProps {
  order: GetUserOrderOutput;
}

export const OrderItemsList = ({ order }: OrderItemsListProps) => {
  const { items } = order;

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Order Items ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-row items-center gap-0 rounded-lg border"
            >
              <div className="relative aspect-[6/7] h-24 w-20 flex-shrink-0">
                <Image
                  src="/images/sample-product/1.jpg" // Placeholder - will be replaced with actual product image
                  alt="Product"
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1 self-stretch px-3 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      Product Name{" "}
                      {/* Placeholder - will be replaced with actual product name */}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatNaira(Number(item.unitPrice))} each
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <XIcon className="size-3" strokeWidth={1.2} />
                      {item.quantity}
                    </div>
                    {item.materialId && (
                      <p className="text-xs text-gray-500">
                        Material:{" "}
                        {/* Placeholder - will be replaced with actual material name */}
                      </p>
                    )}
                    {item.engravings &&
                      Object.keys(item.engravings).length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-700">
                            Engravings:
                          </p>
                          <div className="space-y-1">
                            {Object.entries(item.engravings).map(
                              ([areaId, engraving]) => (
                                <div
                                  key={areaId}
                                  className="text-xs text-gray-600"
                                >
                                  <span className="font-medium">{areaId}:</span>{" "}
                                  {engraving.content}
                                  {engraving.additionalPrice && (
                                    <span className="ml-1 text-green-600">
                                      (+{formatNaira(engraving.additionalPrice)}
                                      )
                                    </span>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    {item.notes && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">
                          Notes:
                        </p>
                        <p className="text-xs text-gray-600">{item.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatNaira(Number(item.totalPrice))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

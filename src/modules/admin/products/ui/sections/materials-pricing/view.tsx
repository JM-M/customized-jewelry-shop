"use client";

import { formatNaira } from "@/lib/utils";

interface MaterialsPricingViewProps {
  price: string | number;
  materials?: Array<{
    material: {
      id: string;
      displayName: string;
      hexColor: string;
    };
    price: string;
    stockQuantity: number | null;
    isDefault: boolean | null;
  }>;
}

export const MaterialsPricingView = ({
  price,
  materials,
}: MaterialsPricingViewProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Base Price</label>
        <p className="text-primary mt-1 text-lg font-semibold">
          {formatNaira(Number(price))}
        </p>
      </div>

      {materials && materials.length > 0 && (
        <div>
          <label className="mb-3 block text-sm font-medium">
            Available Materials
          </label>
          <div className="space-y-2">
            {materials.map((materialItem) => (
              <div
                key={materialItem.material.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="block size-6 shrink-0 rounded-full"
                    style={{ backgroundColor: materialItem.material.hexColor }}
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {materialItem.material.displayName}
                      {materialItem.isDefault && (
                        <span className="text-primary ml-2 text-xs">
                          (Default)
                        </span>
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Stock: {materialItem.stockQuantity ?? 0} available
                    </p>
                  </div>
                </div>
                <p className="text-primary font-semibold">
                  {formatNaira(Number(materialItem.price))}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

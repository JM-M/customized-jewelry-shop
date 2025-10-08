"use client";

interface BasicInformationViewProps {
  name: string;
  category?: {
    name: string;
  };
  description?: string | null;
  sku?: string | null;
  stockQuantity?: number | null;
}

export const BasicInformationView = ({
  name,
  category,
  description,
  sku,
  stockQuantity,
}: BasicInformationViewProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Product Name</label>
        <p className="text-muted-foreground mt-1">{name}</p>
      </div>

      {category && (
        <div>
          <label className="text-sm font-medium">Category</label>
          <p className="text-muted-foreground mt-1">{category.name}</p>
        </div>
      )}

      {description && (
        <div>
          <label className="text-sm font-medium">Description</label>
          <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
            {description}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {sku && (
          <div>
            <label className="text-sm font-medium">SKU</label>
            <p className="text-muted-foreground mt-1">{sku}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Base Stock Quantity</label>
          <p className="text-muted-foreground mt-1">
            {stockQuantity ?? 0} available
          </p>
        </div>
      </div>
    </div>
  );
};

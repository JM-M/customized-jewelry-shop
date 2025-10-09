"use client";

interface ShippingViewProps {
  packaging?: {
    id: string;
    name: string;
    dimensions?: string | null;
    weight?: string | null;
  } | null;
}

export const ShippingView = ({ packaging }: ShippingViewProps) => {
  if (!packaging) {
    return (
      <p className="text-muted-foreground text-sm">No packaging configured</p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Packaging</label>
        <p className="text-muted-foreground mt-1">{packaging.name}</p>
      </div>

      {packaging.dimensions && (
        <div>
          <label className="text-sm font-medium">Dimensions</label>
          <p className="text-muted-foreground mt-1">{packaging.dimensions}</p>
        </div>
      )}

      {packaging.weight && (
        <div>
          <label className="text-sm font-medium">Weight</label>
          <p className="text-muted-foreground mt-1">{packaging.weight}</p>
        </div>
      )}
    </div>
  );
};

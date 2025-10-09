"use client";

interface ShippingViewProps {
  packagingId?: string | null;
}

export const ShippingView = ({ packagingId }: ShippingViewProps) => {
  if (!packagingId) {
    return (
      <p className="text-muted-foreground text-sm">No packaging configured</p>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Packaging ID</label>
        <p className="text-muted-foreground mt-1">{packagingId}</p>
      </div>
    </div>
  );
};

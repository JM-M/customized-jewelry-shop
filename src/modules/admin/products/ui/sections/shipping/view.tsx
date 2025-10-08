"use client";

interface ShippingViewProps {
  packagingId?: string | null;
  // You might want to display packaging name in the future
  // packaging?: {
  //   name: string;
  // };
}

export const ShippingView = ({ packagingId }: ShippingViewProps) => {
  if (!packagingId) {
    return (
      <p className="text-muted-foreground text-sm">No packaging configured</p>
    );
  }

  return (
    <div>
      <label className="text-sm font-medium">Packaging ID</label>
      <p className="text-muted-foreground mt-1">{packagingId}</p>
    </div>
  );
};

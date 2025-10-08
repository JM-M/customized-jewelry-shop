"use client";

interface ProductImagesViewProps {
  images: string[];
}

export const ProductImagesView = ({ images }: ProductImagesViewProps) => {
  if (images.length === 0) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
        No images uploaded
      </div>
    );
  }

  const primaryImage = images[0];
  const otherImages = images.slice(1);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Primary Image</label>
        <div className="border-primary relative overflow-hidden rounded-lg border-2">
          <img
            src={primaryImage}
            alt="Primary product image"
            className="h-48 w-full object-cover"
          />
          <div className="bg-primary text-primary-foreground absolute top-2 left-2 rounded px-2 py-1 text-xs font-semibold">
            Primary
          </div>
        </div>
      </div>

      {otherImages.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Additional Images
          </label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {otherImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product image ${index + 2}`}
                className="border-border h-32 w-full rounded-lg border-2 object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

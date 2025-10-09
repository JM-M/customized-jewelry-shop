"use client";

interface BasicInformationViewProps {
  name: string;
  category?: {
    name: string;
  };
  description?: string | null;
}

export const BasicInformationView = ({
  name,
  category,
  description,
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
    </div>
  );
};

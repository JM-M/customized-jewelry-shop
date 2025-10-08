"use client";

interface CustomizationOptionsViewProps {
  options?: Array<{
    id: string;
    name: string;
    description: string | null;
    type: string;
    maxCharacters: number | null;
    sampleImage: string | null;
  }>;
}

export const CustomizationOptionsView = ({
  options,
}: CustomizationOptionsViewProps) => {
  if (!options || options.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No customization options available
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option.id} className="rounded-lg border p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h4 className="font-medium">{option.name}</h4>
              <p className="text-muted-foreground text-xs">
                Type: {option.type}
              </p>
            </div>
            {option.type === "text" && option.maxCharacters && (
              <span className="text-muted-foreground text-xs">
                Max {option.maxCharacters} chars
              </span>
            )}
          </div>

          {option.description && (
            <p className="text-muted-foreground mb-2 text-sm">
              {option.description}
            </p>
          )}

          {option.sampleImage && (
            <img
              src={option.sampleImage}
              alt={option.name}
              className="h-24 w-full rounded object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

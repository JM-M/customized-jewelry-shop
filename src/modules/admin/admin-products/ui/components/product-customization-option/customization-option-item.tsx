import { Trash2 } from "lucide-react";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { CustomizationOption } from "@/modules/products/types";

interface CustomizationOptionItemProps {
  option: CustomizationOption;
  onRemove: () => void;
  isRemoving?: boolean;
}

export const CustomizationOptionItem = ({
  option,
  onRemove,
  isRemoving = false,
}: CustomizationOptionItemProps) => {
  return (
    <div className="relative rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{option.name}</h4>
          {option.description && (
            <p className="text-muted-foreground text-sm">
              {option.description}
            </p>
          )}
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
              {option.type.replace("_", " ").toUpperCase()}
            </span>
            {option.maxCharacters && (
              <span className="text-muted-foreground text-xs">
                Max {option.maxCharacters} characters
              </span>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={isRemoving}
        className="text-muted-foreground hover:text-destructive absolute right-2 bottom-2 h-8 w-8 p-0"
      >
        {isRemoving ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

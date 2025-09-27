"use client";

import { Badge } from "@/components/ui/badge";
import { TerminalPackaging } from "@/modules/terminal/types";

interface PackagingInfoProps {
  packaging: TerminalPackaging;
}

export const PackagingInfo = ({ packaging }: PackagingInfoProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{packaging.name}</span>
        </div>
        {packaging.default && (
          <Badge
            variant="secondary"
            className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
          >
            Default
          </Badge>
        )}
      </div>
      <div>
        <span className="text-muted-foreground text-sm uppercase">
          {packaging.type}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Dimensions:</span>
          <p className="font-medium">
            {packaging.length} × {packaging.width} × {packaging.height}{" "}
            {packaging.size_unit}
          </p>
        </div>
        <div>
          <span className="text-muted-foreground">Weight Capacity:</span>
          <p className="font-medium">
            {packaging.weight} {packaging.weight_unit}
          </p>
        </div>
      </div>
    </div>
  );
};

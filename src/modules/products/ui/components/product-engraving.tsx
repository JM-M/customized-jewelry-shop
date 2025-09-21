"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { GetEngravingAreasByProductIdOutput } from "@/modules/products/types";
import { useState } from "react";

interface ProductEngravingProps {
  productEngravingAreas: GetEngravingAreasByProductIdOutput;
}

export const ProductEngraving = ({
  productEngravingAreas,
}: ProductEngravingProps) => {
  const [engravings, setEngravings] = useState<Record<string, string>>({});
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleEngravingChange = (areaId: string, value: string) => {
    setEngravings((prev) => ({
      ...prev,
      [areaId]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productEngravingAreas.map((area) => (
          <Card
            key={area.engravingArea.id}
            className={cn(
              "p-4 shadow-none transition-all",
              engravings[area.engravingArea.id] && "ring-primary/20 ring-1",
            )}
          >
            <div className="space-y-3">
              {/* Part Name and Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor={`engraving-${area.engravingArea.id}`}
                    className="text-sm font-medium"
                  >
                    {area.engravingArea.name}
                  </Label>
                  {area.referenceImage && (
                    <Dialog
                      open={openDialog === area.engravingArea.id}
                      onOpenChange={(open) =>
                        setOpenDialog(open ? area.engravingArea.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          See example
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {area.engravingArea.name} - Engraving Example
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center">
                          <img
                            src={area.referenceImage}
                            alt={`${area.engravingArea.name} engraving example`}
                            className="max-h-96 w-auto rounded-lg object-contain"
                          />
                        </div>
                        {area.engravingArea.description && (
                          <p className="text-muted-foreground text-center text-sm">
                            {area.engravingArea.description}
                          </p>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <Input
                  id={`engraving-${area.engravingArea.id}`}
                  placeholder={`Enter text for ${area.engravingArea.name.toLowerCase()}`}
                  className="text-sm"
                  value={engravings[area.engravingArea.id] || ""}
                  onChange={(e) =>
                    handleEngravingChange(area.engravingArea.id, e.target.value)
                  }
                />
                {area.engravingArea.description && (
                  <p className="text-muted-foreground text-xs">
                    {area.engravingArea.description}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      {Object.keys(engravings).some((key) => engravings[key]) && (
        <Card className="bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-medium">Engraving Summary</h4>
          <div className="text-muted-foreground space-y-1 text-sm">
            {productEngravingAreas.map(
              (area) =>
                engravings[area.engravingArea.id] && (
                  <div
                    key={area.engravingArea.id}
                    className="flex justify-between"
                  >
                    <span>{area.engravingArea.name}:</span>
                    <span className="text-foreground font-medium">
                      &quot;{engravings[area.engravingArea.id]}&quot;
                    </span>
                  </div>
                ),
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

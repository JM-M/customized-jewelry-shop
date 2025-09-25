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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  EngravingContent,
  GetEngravingAreasByProductIdOutput,
} from "@/modules/products/types";
import { useState } from "react";
import { ImageEngravingInput } from "./engraving-inputs/image-engraving-input";
import { QREngravingInput } from "./engraving-inputs/qr-engraving-input";
import { TextEngravingInput } from "./engraving-inputs/text-engraving-input";
import { EngravingPreview } from "./engraving-preview";

interface ProductEngravingProps {
  productEngravingAreas: GetEngravingAreasByProductIdOutput;
  engravings: Record<string, EngravingContent>;
  onEngravingChange: (areaId: string, content: EngravingContent) => void;
}

export const ProductEngraving = ({
  productEngravingAreas,
  engravings,
  onEngravingChange,
}: ProductEngravingProps) => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {productEngravingAreas.map((area) => {
          const currentEngraving = engravings[area.engravingArea.id];
          const engravingType = area.engravingType;

          return (
            <Card
              key={area.engravingArea.id}
              className={cn(
                "p-4 shadow-none transition-all",
                currentEngraving && "ring-primary/20 ring-1",
              )}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
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
                          <Button variant="ghost" size="sm" className="h-fit">
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
                  {area.engravingArea.description && (
                    <p className="text-muted-foreground text-xs">
                      {area.engravingArea.description}
                    </p>
                  )}
                </div>

                {/* Type-specific input */}
                {engravingType === "text" && (
                  <TextEngravingInput
                    maxCharacters={area.maxCharacters ?? undefined}
                    value={currentEngraving?.textContent || ""}
                    onChange={(textContent) =>
                      onEngravingChange(area.engravingArea.id, {
                        id: area.engravingArea.id,
                        type: "text",
                        textContent,
                      })
                    }
                    placeholder={`Enter text for ${area.engravingArea.name.toLowerCase()}`}
                  />
                )}

                {engravingType === "image" && (
                  <ImageEngravingInput
                    value={currentEngraving?.imageUrl}
                    onChange={(imageData) =>
                      onEngravingChange(area.engravingArea.id, {
                        id: area.engravingArea.id,
                        type: "image",
                        ...imageData,
                      })
                    }
                  />
                )}

                {engravingType === "qr_code" && (
                  <QREngravingInput
                    value={currentEngraving?.qrData || ""}
                    qrSize={currentEngraving?.qrSize || 200}
                    onChange={(qrData, qrSize) =>
                      onEngravingChange(area.engravingArea.id, {
                        id: area.engravingArea.id,
                        type: "qr_code",
                        qrData,
                        qrSize,
                      })
                    }
                  />
                )}

                {/* Preview */}
                {currentEngraving && (
                  <EngravingPreview
                    content={currentEngraving}
                    type={engravingType}
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {Object.keys(engravings).some((key) => engravings[key]) && (
        <Card className="bg-muted/30 p-4">
          <h4 className="mb-2 text-sm font-medium">Engraving Summary</h4>
          <div className="text-muted-foreground space-y-2 text-sm">
            {productEngravingAreas.map((area) => {
              const engraving = engravings[area.engravingArea.id];
              if (!engraving) return null;

              return (
                <div key={area.engravingArea.id} className="space-y-1">
                  <div className="flex items-start justify-between">
                    <span className="font-medium">
                      {area.engravingArea.name}:
                    </span>
                    <span className="text-foreground text-right">
                      {engraving.type === "text" && engraving.textContent && (
                        <span>&quot;{engraving.textContent}&quot;</span>
                      )}
                      {engraving.type === "image" &&
                        engraving.imageFilename && (
                          <span>📷 {engraving.imageFilename}</span>
                        )}
                      {engraving.type === "qr_code" && engraving.qrData && (
                        <span>
                          🔲 QR Code: {engraving.qrData.substring(0, 20)}...
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Type: {engraving.type.replace("_", " ").toUpperCase()}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

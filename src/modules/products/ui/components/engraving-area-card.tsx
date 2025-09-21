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
import { GetEngravingAreasByProductIdOutput } from "@/modules/products/types";
import { ImageEngravingInput } from "./engraving-inputs/image-engraving-input";
import { QREngravingInput } from "./engraving-inputs/qr-engraving-input";
import { TextEngravingInput } from "./engraving-inputs/text-engraving-input";
import { EngravingPreview } from "./engraving-preview";

// TODO: Tailor this to fit the business need

interface EngravingAreaCardProps {
  area: GetEngravingAreasByProductIdOutput[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any; // You can type this properly based on your needs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (content: any) => void;
  openDialog: string | null;
  setOpenDialog: (id: string | null) => void;
}

export const EngravingAreaCard = ({
  area,
  content,
  onChange,
  openDialog,
  setOpenDialog,
}: EngravingAreaCardProps) => {
  const engravingType = area.engravingType as "text" | "image" | "qr_code";

  return (
    <Card
      className={cn(
        "p-4 shadow-none transition-all",
        content && "ring-primary/20 ring-1",
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
            value={content?.textContent || ""}
            onChange={(textContent) =>
              onChange({
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
            value={content?.imageUrl}
            onChange={(imageData) =>
              onChange({
                id: area.engravingArea.id,
                type: "image",
                ...imageData,
              })
            }
          />
        )}

        {engravingType === "qr_code" && (
          <QREngravingInput
            value={content?.qrData || ""}
            qrSize={content?.qrSize || 200}
            onChange={(qrData, qrSize) =>
              onChange({
                id: area.engravingArea.id,
                type: "qr_code",
                qrData,
                qrSize,
              })
            }
          />
        )}

        {/* Preview */}
        {content && <EngravingPreview content={content} type={engravingType} />}
      </div>
    </Card>
  );
};

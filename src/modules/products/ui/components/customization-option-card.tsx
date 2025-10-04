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
  CustomizationType,
  GetProductCustomizationOptionsOutput,
} from "@/modules/products/types";
import { CustomizationPreview } from "./customization-preview";
import { ImageEngravingInput } from "./engraving-inputs/image-engraving-input";
import { QREngravingInput } from "./engraving-inputs/qr-engraving-input";
import { TextEngravingInput } from "./engraving-inputs/text-engraving-input";

// TODO: Tailor this to fit the business need

interface CustomizationOptionCardProps {
  option: GetProductCustomizationOptionsOutput[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any; // You can type this properly based on your needs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (content: any) => void;
  openDialog: string | null;
  setOpenDialog: (id: string | null) => void;
}

export const CustomizationOptionCard = ({
  option,
  content,
  onChange,
  openDialog,
  setOpenDialog,
}: CustomizationOptionCardProps) => {
  const customizationType = option.type as CustomizationType;

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
            <Label className="text-sm font-medium">{option.name}</Label>
            {option.sampleImage && (
              <Dialog
                open={openDialog === option.id}
                onOpenChange={(open) => setOpenDialog(open ? option.id : null)}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    See example
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {option.name} - Customization Example
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img
                      src={option.sampleImage}
                      alt={`${option.name} customization example`}
                      className="max-h-96 w-auto rounded-lg object-contain"
                    />
                  </div>
                  {option.description && (
                    <p className="text-muted-foreground text-center text-sm">
                      {option.description}
                    </p>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
          {option.description && (
            <p className="text-muted-foreground text-xs">
              {option.description}
            </p>
          )}
        </div>

        {/* Type-specific input */}
        {customizationType === "text" && (
          <TextEngravingInput
            maxCharacters={option.maxCharacters ?? undefined}
            value={content?.textContent || ""}
            onChange={(textContent) =>
              onChange({
                id: option.id,
                type: "text",
                textContent,
              })
            }
            placeholder={`Enter text for ${option.name.toLowerCase()}`}
          />
        )}

        {customizationType === "image" && (
          <ImageEngravingInput
            value={content?.imageUrl}
            onChange={(imageData) =>
              onChange({
                id: option.id,
                type: "image",
                ...imageData,
              })
            }
          />
        )}

        {customizationType === "qr_code" && (
          <QREngravingInput
            value={content?.qrData || ""}
            qrSize={content?.qrSize || 200}
            onChange={(qrData, qrSize) =>
              onChange({
                id: option.id,
                type: "qr_code",
                qrData,
                qrSize,
              })
            }
          />
        )}

        {/* Preview */}
        {content && (
          <CustomizationPreview content={content} type={customizationType} />
        )}
      </div>
    </Card>
  );
};

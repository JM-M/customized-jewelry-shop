"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Customization } from "@/modules/products/types";
import { ImageIcon, QrCodeIcon, Type } from "lucide-react";

interface CustomizationPreviewProps {
  content?: Customization;
  type: Customization["type"];
}

const getTypeIcon = (type: Customization["type"]) => {
  switch (type) {
    case "text":
      return <Type className="h-4 w-4" />;
    case "image":
      return <ImageIcon className="h-4 w-4" />;
    case "qr_code":
      return <QrCodeIcon className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: Customization["type"]) => {
  switch (type) {
    case "text":
      return "Text Customization";
    case "image":
      return "Image Customization";
    case "qr_code":
      return "QR Code Customization";
  }
};

export const CustomizationPreview = ({
  content,
  type,
}: CustomizationPreviewProps) => {
  if (!content) return null;

  return (
    <Card className="border-muted-foreground/25 border-dashed p-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          <Label className="text-xs font-medium">{getTypeLabel(type)}</Label>
        </div>

        {type === "text" && content.content && (
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {'"'}
              {content.content}
              {'"'}
            </p>
            <p className="text-muted-foreground text-xs">
              {content.content.length} characters
            </p>
          </div>
        )}

        {type === "image" && content.content && (
          <div className="space-y-1">
            <div className="bg-muted/20 flex h-20 w-full items-center justify-center rounded border">
              <span className="text-muted-foreground text-sm">
                Image uploaded
              </span>
            </div>
            <p className="text-muted-foreground text-xs">{content.content}</p>
          </div>
        )}

        {type === "qr_code" && content.content && (
          <div className="space-y-1">
            <div className="bg-muted/20 flex justify-center rounded border p-2">
              <div className="flex h-16 w-16 items-center justify-center rounded bg-black">
                <span className="text-xs text-white">QR</span>
              </div>
            </div>
            <p className="text-muted-foreground text-center text-xs">
              {content.content.length > 25
                ? `${content.content.substring(0, 25)}...`
                : content.content}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

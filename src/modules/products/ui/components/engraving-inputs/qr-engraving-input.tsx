"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface QREngravingInputProps {
  value: string;
  qrSize: number;
  onChange: (qrData: string, qrSize: number) => void;
}

export const QREngravingInput = ({
  value,
  qrSize,
  onChange,
}: QREngravingInputProps) => {
  const [qrPreview, setQrPreview] = useState<string>("");

  // Generate QR code preview using a simple placeholder for now
  // In a real app, you'd use a QR code library like 'qrcode' or 'react-qr-code'
  useEffect(() => {
    if (value) {
      // For now, create a simple placeholder
      // In production, you'd use: import QRCode from 'qrcode'
      // const qrDataURL = await QRCode.toDataURL(value, { width: qrSize })
      // setQrPreview(qrDataURL);

      // Placeholder QR code (you can replace this with actual QR generation)
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = qrSize;
      canvas.height = qrSize;

      if (ctx) {
        // Simple placeholder pattern
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, qrSize, qrSize);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(8, 8, qrSize - 16, qrSize - 16);
        ctx.fillStyle = "#000000";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("QR", qrSize / 2, qrSize / 2);
      }

      setQrPreview(canvas.toDataURL());
    } else {
      setQrPreview("");
    }
  }, [value, qrSize]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="qr-data">QR Code Data</Label>
        <Input
          id="qr-data"
          value={value}
          onChange={(e) => onChange(e.target.value, qrSize)}
          placeholder="Enter URL, text, or data for QR code..."
          className="text-sm"
        />
        <p className="text-muted-foreground text-xs">
          This will be encoded into the QR code
        </p>
      </div>

      {/* This does not seem necessary */}
      {/* <div className="space-y-2">
        <Label htmlFor="qr-size">QR Code Size</Label>
        <Select
          value={qrSize.toString()}
          onValueChange={(size) => onChange(value, parseInt(size))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {qrPreview && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="bg-muted/20 flex justify-center rounded-lg border p-4">
            <img
              src={qrPreview}
              alt="QR Code Preview"
              className="rounded border"
            />
          </div>
          <p className="text-muted-foreground text-center text-xs">
            QR Code:{" "}
            {value.length > 30 ? `${value.substring(0, 30)}...` : value}
          </p>
        </div>
      )}
    </div>
  );
};

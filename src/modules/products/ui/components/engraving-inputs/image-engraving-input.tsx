"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadIcon, X } from "lucide-react";
import { useState } from "react";

interface ImageEngravingInputProps {
  maxSizeMB?: number;
  allowedFormats?: string[];
  value?: string;
  onChange: (imageData: {
    imageUrl: string;
    imageFilename: string;
    imageSizeBytes: number;
  }) => void;
}

export const ImageEngravingInput = ({
  maxSizeMB = 5,
  allowedFormats = ["jpg", "jpeg", "png", "svg"],
  value,
  onChange,
}: ImageEngravingInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File too large. Max size: ${maxSizeMB}MB`);
      }

      // Validate file format
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!fileExtension || !allowedFormats.includes(fileExtension)) {
        throw new Error(
          `Invalid format. Allowed: ${allowedFormats.join(", ")}`,
        );
      }

      // Create a preview URL (in a real app, you'd upload to cloud storage)
      const imageUrl = URL.createObjectURL(file);

      onChange({
        imageUrl,
        imageFilename: file.name,
        imageSizeBytes: file.size,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    onChange({
      imageUrl: "",
      imageFilename: "",
      imageSizeBytes: 0,
    });
    setError(null);
  };

  return (
    <div className="space-y-3">
      <Label>Image Content</Label>

      {!value ? (
        <div className="space-y-2">
          <div className="flex w-full items-center justify-center">
            <label
              htmlFor="image-upload"
              className="border-muted-foreground/25 hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon
                  className="text-muted-foreground mb-2 h-8 w-8"
                  strokeWidth={1.2}
                />
                <p className="text-muted-foreground mb-2 text-sm">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-muted-foreground text-xs">
                  {allowedFormats.join(", ").toUpperCase()} (MAX {maxSizeMB}MB)
                </p>
              </div>
              <Input
                id="image-upload"
                type="file"
                accept={allowedFormats.map((f) => `.${f}`).join(",")}
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <img
              src={value}
              alt="Upload preview"
              className="h-32 w-full rounded-lg border object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      {isUploading && (
        <p className="text-muted-foreground text-sm">Uploading...</p>
      )}
    </div>
  );
};

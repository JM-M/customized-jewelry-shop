"use client";

import { Dropzone } from "@/components/shared";
import { BUCKETS } from "@/constants/storage";

interface ImageCustomizationOptionProps {
  option: {
    id: string;
    name: string;
    description?: string | null;
  };
  value: string;
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export const ImageCustomizationOption = ({
  option,
  value,
  onUploadSuccess,
  onUploadError,
}: ImageCustomizationOptionProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {option.name}
      </label>
      {option.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {option.description}
        </p>
      )}
      <Dropzone
        id={`image-upload-${option.id}`}
        accept="image/*"
        showPreview={true}
        enableUpload={true}
        bucket={BUCKETS.PRODUCT_CUSTOMIZATIONS}
        maxSizeMB={10}
        allowedFormats={["jpg", "jpeg", "png", "webp", "svg"]}
        onFileChange={(file) => {
          // Store the file temporarily, but don't update customization until upload succeeds
          console.log("File selected:", file?.name);
        }}
        onUploadSuccess={onUploadSuccess}
        onUploadError={(error) => {
          console.error("Image upload failed:", error);
          onUploadError?.(error);
          // You could add toast notifications here
        }}
      />
      {value && (
        <p className="text-xs text-green-600">Image uploaded successfully</p>
      )}
    </div>
  );
};

"use client";

import { Dropzone } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { BUCKETS } from "@/constants/storage";
import { useProduct } from "../../contexts/product";

export const ProductCustomizationOptions = () => {
  const { customizationOptions, customizations, updateCustomization } =
    useProduct();
  if (customizationOptions.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        No customization options available for this product.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customizationOptions.map((option) => (
        <div key={option.id} className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {option.name}
          </label>
          {option.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {option.description}
            </p>
          )}

          {option.type === "text" && (
            <Input
              type="text"
              placeholder="Enter text..."
              // maxLength={option.maxCharacters} TODO: Either remove max length from schema or implement it
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={customizations[option.id]?.textContent || ""}
              onChange={(e) =>
                updateCustomization(option.id, {
                  id: option.id,
                  type: "text",
                  textContent: e.target.value,
                })
              }
            />
          )}

          {option.type === "image" && (
            <div className="space-y-2">
              <Dropzone
                id={`image-upload-${option.id}`}
                accept="image/*"
                showPreview={true}
                enableUpload={true}
                bucket={BUCKETS.PRODUCT_CUSTOMIZATIONS}
                maxSizeMB={10}
                allowedFormats={["jpg", "jpeg", "png", "webp", "svg"]}
                onFileChange={(file) =>
                  updateCustomization(option.id, {
                    id: option.id,
                    type: "image",
                    imageFile: file,
                  })
                }
                onUploadSuccess={(url) =>
                  updateCustomization(option.id, {
                    id: option.id,
                    type: "image",
                    imageUrl: url,
                    imageFile: customizations[option.id]?.imageFile,
                  })
                }
                onUploadError={(error) => {
                  console.error("Image upload failed:", error);
                  // You could add toast notifications here
                }}
              />
              {customizations[option.id]?.imageFile && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  Image selected: {customizations[option.id].imageFile?.name}
                </p>
              )}
              {customizations[option.id]?.imageUrl && (
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  ✓ Image uploaded successfully
                </p>
              )}
            </div>
          )}

          {option.type === "qr_code" && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              QR code generation functionality to be implemented
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

"use client";

import { useProduct } from "../../contexts/product";
import { ImageCustomizationOption } from "./image-customization-option";
import { TextCustomizationOption } from "./text-customization-option";

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
        <div key={option.id}>
          {option.type === "text" && (
            <TextCustomizationOption
              option={option}
              value={customizations[option.id]?.content || ""}
              onChange={(value, font) =>
                updateCustomization(option.id, {
                  name: option.name,
                  type: "text",
                  content: value,
                  font,
                })
              }
            />
          )}

          {option.type === "image" && (
            <ImageCustomizationOption
              option={option}
              value={customizations[option.id]?.content || ""}
              onUploadSuccess={(url) =>
                updateCustomization(option.id, {
                  name: option.name,
                  type: "image",
                  content: url,
                })
              }
              onUploadError={(error) => {
                console.error("Image upload failed:", error);
                // You could add toast notifications here
              }}
            />
          )}

          {option.type === "qr_code" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {option.name}
              </label>
              {option.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                QR code generation functionality to be implemented
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

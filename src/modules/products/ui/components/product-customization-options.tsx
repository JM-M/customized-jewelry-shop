"use client";

import { CustomizationContent, CustomizationOption } from "../../types";

interface ProductCustomizationOptionsProps {
  customizationOptions: CustomizationOption[];
  customizations: Record<string, CustomizationContent>;
  onCustomizationChange: (
    optionId: string,
    content: CustomizationContent,
  ) => void;
}

export const ProductCustomizationOptions = ({
  customizationOptions,
  customizations,
  onCustomizationChange,
}: ProductCustomizationOptionsProps) => {
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
            <input
              type="text"
              placeholder="Enter text..."
              maxLength={option.maxCharacters}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={customizations[option.id]?.textContent || ""}
              onChange={(e) =>
                onCustomizationChange(option.id, {
                  id: option.id,
                  type: "text",
                  textContent: e.target.value,
                })
              }
            />
          )}

          {option.type === "image" && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Image upload functionality to be implemented
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

"use client";

import * as React from "react";

import { GoogleFontLoader } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TextCustomizationOptionProps {
  option: {
    id: string;
    name: string;
    description?: string | null;
    maxCharacters?: number | null;
  };
  value: string;
  onChange: (value: string, font?: { name: string; id: string }) => void;
}

interface FontOption {
  id: string;
  name: string;
  preview: string;
}

const fontOptions: FontOption[] = [
  { id: "pacifico", name: "Pacifico", preview: "Abc" },
  { id: "great-vibes", name: "Great Vibes", preview: "Abc" },
  { id: "dancing-script", name: "Dancing Script", preview: "Abc" },
  { id: "allura", name: "Allura", preview: "Abc" },
  { id: "satisfy", name: "Satisfy", preview: "Abc" },
  { id: "sacramento", name: "Sacramento", preview: "Abc" },
  { id: "alex-brush", name: "Alex Brush", preview: "Abc" },
  { id: "parisienne", name: "Parisienne", preview: "Abc" },
  { id: "cookie", name: "Cookie", preview: "Abc" },
  { id: "yellowtail", name: "Yellowtail", preview: "Abc" },
  { id: "lobster", name: "Lobster", preview: "Abc" },
  { id: "lobster-two", name: "Lobster Two", preview: "Abc" },
];

export const TextCustomizationOption = ({
  option,
  value,
  onChange,
}: TextCustomizationOptionProps) => {
  const [selectedFont, setSelectedFont] = React.useState<string>("pacifico");

  return (
    <div className="space-y-3">
      {/* Load all fonts for preview */}
      {fontOptions.map((font) => (
        <GoogleFontLoader key={font.id} font={font.name} />
      ))}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {option.name}
        </label>
        {option.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {option.description}
          </p>
        )}
        <Input
          type="text"
          placeholder="Enter engraving text"
          // maxLength={option.maxCharacters} TODO: Either remove max length from schema or implement it
          className="h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-xl font-medium placeholder:font-sans placeholder:text-base placeholder:font-normal focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          style={{
            fontFamily: fontOptions.find((font) => font.id === selectedFont)
              ?.name,
          }}
          value={value}
          onChange={(e) => {
            const selectedFontData = fontOptions.find(
              (font) => font.id === selectedFont,
            );
            onChange(
              e.target.value,
              selectedFontData
                ? { name: selectedFontData.name, id: selectedFontData.id }
                : undefined,
            );
          }}
        />
        {/* Text Preview */}
        {/* {value && (
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
              Preview:
            </p>
            <p className="font-custom text-lg text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        )} */}
      </div>

      {/* Font Selection Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Font
        </label>
        <div className="grid grid-cols-4 gap-3">
          {fontOptions.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => {
                setSelectedFont(font.id);
                // Update customization with new font when font changes
                if (value) {
                  onChange(value, { name: font.name, id: font.id });
                }
              }}
              className={cn(
                "relative flex flex-col items-center space-y-2 rounded-lg border-2 p-3 transition-all hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
                selectedFont === font.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
              )}
            >
              <div
                className="text-lg font-medium text-black dark:text-white"
                style={{ fontFamily: font.name }}
              >
                {font.preview}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {font.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

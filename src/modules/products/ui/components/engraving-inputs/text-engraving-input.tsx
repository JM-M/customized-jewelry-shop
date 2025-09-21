"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextEngravingInputProps {
  maxCharacters?: number;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextEngravingInput = ({
  maxCharacters,
  value,
  onChange,
  placeholder = "Enter your text...",
}: TextEngravingInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="text-input">Text Content</Label>
      <Input
        id="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxCharacters}
        placeholder={placeholder}
        className="text-sm"
      />
      {maxCharacters && (
        <p className="text-muted-foreground text-xs">
          {value.length}/{maxCharacters} characters
        </p>
      )}
    </div>
  );
};

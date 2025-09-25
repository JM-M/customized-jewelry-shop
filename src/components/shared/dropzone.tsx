"use client";

import { Input } from "@/components/ui/input";
import { UploadIcon } from "lucide-react";
import { forwardRef } from "react";

interface DropzoneProps {
  id: string;
  accept?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLLabelElement>) => void;
}

export const Dropzone = forwardRef<HTMLLabelElement, DropzoneProps>(
  (
    {
      id,
      accept,
      disabled = false,
      className = "",
      children,
      onFileChange,
      onDragOver,
      onDragLeave,
      onDrop,
    },
    ref,
  ) => {
    return (
      <div className="flex w-full items-center justify-center">
        <label
          ref={ref}
          htmlFor={id}
          className={`border-muted-foreground/25 hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          } ${className}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {children || (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon
                className="text-muted-foreground mb-2 h-8 w-8"
                strokeWidth={1.2}
              />
              <p className="text-muted-foreground mb-2 text-sm">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            </div>
          )}
          <Input
            id={id}
            type="file"
            accept={accept}
            onChange={onFileChange}
            disabled={disabled}
            className="hidden"
          />
        </label>
      </div>
    );
  },
);

Dropzone.displayName = "Dropzone";

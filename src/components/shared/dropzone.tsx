"use client";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadFileToBucket } from "@/hooks/use-upload-file-to-bucket";
import { Edit3, UploadIcon, X } from "lucide-react";
import { forwardRef, useState } from "react";

interface DropzoneProps {
  id: string;
  accept?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onFileChange?: (file: File | null) => void;
  onDragOver?: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLLabelElement>) => void;
  showPreview?: boolean;
  previewClassName?: string;
  // Upload-related props
  enableUpload?: boolean;
  bucket?: string;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  maxSizeMB?: number;
  allowedFormats?: string[];
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
      showPreview = false,
      previewClassName = "",
      enableUpload = false,
      bucket = "images",
      onUploadSuccess,
      onUploadError,
      maxSizeMB = 5,
      allowedFormats = ["jpg", "jpeg", "png", "svg", "webp"],
    },
    ref,
  ) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
      uploadFile,
      isUploading,
      error: uploadError,
      data: uploadedUrl,
      reset: resetUpload,
    } = useUploadFileToBucket({
      bucket,
      maxSizeMB,
      allowedFormats,
      onSuccess: onUploadSuccess,
      onError: onUploadError,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setSelectedFile(file);

      if (file) {
        if (showPreview) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }

        // If upload is enabled, upload immediately
        if (enableUpload) {
          uploadFile(file);
        }
      } else {
        setPreviewUrl(null);
        resetUpload();
      }

      onFileChange?.(file);
    };

    const handleRemoveFile = () => {
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      resetUpload();
      onFileChange?.(null);
    };

    const handleChangeFile = () => {
      // Trigger file input click
      const fileInput = document.getElementById(id) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      onDragOver?.(e);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      onDragLeave?.(e);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        setSelectedFile(file);

        if (showPreview) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }

        // If upload is enabled, upload immediately
        if (enableUpload) {
          uploadFile(file);
        }

        onFileChange?.(file);
      }
      onDrop?.(e);
    };

    return (
      <div className="flex w-full items-center justify-center">
        {/* Hidden file input - always present */}
        <Input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        {showPreview && (previewUrl || uploadedUrl) ? (
          <div className={`relative w-full ${previewClassName}`}>
            <img
              src={uploadedUrl || previewUrl || ""}
              alt="Preview"
              className="h-32 w-full cursor-pointer rounded-lg object-contain transition-opacity hover:opacity-90"
              onClick={handleChangeFile}
              title="Click to change image"
            />

            {/* Upload error message */}
            {uploadError && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-500/90 text-white">
                <div className="text-center">
                  <p className="text-sm font-medium">Upload Failed</p>
                  <p className="text-xs">{uploadError}</p>
                </div>
              </div>
            )}

            {/* Uploading spinner overlay */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                <div className="flex flex-col items-center gap-2 text-white">
                  <Spinner className="h-6 w-6" />
                  <p className="text-sm">Uploading...</p>
                </div>
              </div>
            )}

            {/* Remove button - top right */}
            <div className="absolute top-2 right-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={handleRemoveFile}
                disabled={disabled || isUploading}
                className="h-8 w-8"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Edit button - bottom right */}
            <div className="absolute right-2 bottom-2">
              <Button
                type="button"
                variant="default"
                size="icon"
                onClick={handleChangeFile}
                disabled={disabled || isUploading}
                className="h-8 w-8"
                title="Change image"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative w-full">
            <label
              ref={ref}
              htmlFor={id}
              className={`border-muted-foreground/25 hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                disabled || isUploading ? "cursor-not-allowed opacity-50" : ""
              } ${className}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {children || (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon
                    className="text-muted-foreground mb-2 h-8 w-8"
                    strokeWidth={1.2}
                  />
                  <p className="text-muted-foreground mb-2 text-sm">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                </div>
              )}
            </label>

            {/* Uploading spinner overlay for dropzone */}
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                <div className="flex flex-col items-center gap-2 text-white">
                  <Spinner className="h-6 w-6" />
                  <p className="text-sm">Uploading...</p>
                </div>
              </div>
            )}

            {/* Upload error message for dropzone */}
            {uploadError && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-500/90 text-white">
                <div className="text-center">
                  <p className="text-sm font-medium">Upload Failed</p>
                  <p className="text-xs">{uploadError}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

Dropzone.displayName = "Dropzone";

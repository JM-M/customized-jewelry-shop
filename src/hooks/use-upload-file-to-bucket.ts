import { useMutation } from "@tanstack/react-query";

import { uploadFilesToBucket } from "@/lib/supabase/storage";

interface UseUploadFileToBucketOptions {
  bucket?: string;
  maxSizeMB?: number;
  allowedFormats?: string[];
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

interface UploadFileParams {
  file: File;
  bucket: string;
}

export const useUploadFileToBucket = ({
  bucket = "images",
  maxSizeMB = 5,
  allowedFormats = ["jpg", "jpeg", "png", "svg", "webp"],
  onSuccess,
  onError,
}: UseUploadFileToBucketOptions = {}) => {
  const validateFile = (file: File): string | null => {
    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large. Max size: ${maxSizeMB}MB`;
    }

    // Validate file format
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      return `Invalid format. Allowed: ${allowedFormats.join(", ")}`;
    }

    return null;
  };

  const uploadMutation = useMutation({
    mutationFn: async ({ file, bucket }: UploadFileParams) => {
      const validationError = validateFile(file);
      if (validationError) {
        throw new Error(validationError);
      }

      const uploadResult = await uploadFilesToBucket({
        files: [file],
        bucket,
      });

      const result = uploadResult[0];
      if (result && "publicUrl" in result) {
        return result.publicUrl;
      } else {
        throw new Error("Upload failed - no URL returned");
      }
    },
    onSuccess: (url) => {
      onSuccess?.(url);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      onError?.(errorMessage);
    },
  });

  const uploadFile = (file: File, customBucket?: string) => {
    return uploadMutation.mutate({
      file,
      bucket: customBucket || bucket,
    });
  };

  return {
    uploadFile,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error?.message || null,
    data: uploadMutation.data,
    reset: uploadMutation.reset,
  };
};

import supabase from "@/supabase";

import { v4 as uuidv4 } from "uuid";

export const uploadFilesToBucket = async ({
  files,
  bucket,
}: {
  files: File[];
  bucket: string;
}): Promise<
  (
    | {
        publicUrl: string;
      }
    | File
    | null
  )[]
> => {
  const uploadPromises = files.map(async (file) => {
    if (file) {
      const id = uuidv4();
      const fileExtension = file.name.split(".").pop();
      const fileName = `${id}.${fileExtension}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading file:", error.message);

        return null; // Return null to signify failure
      } else {
        const { data: publicFile } = await supabase.storage
          .from(bucket)
          .getPublicUrl(data?.path);

        return publicFile;
      }
    }

    return null;
  });

  // Wait for all upload promises to complete
  const uploadedFiles = await Promise.all(uploadPromises);

  // Filter out any null values (failed uploads)
  return uploadedFiles;
};

const extractFilePathFromUrl = (
  url: string,
): { bucket: string; path: string } | null => {
  const regex = /storage\/v1\/object\/public\/([^/]+)\/(.+)/;
  const match = url.match(regex);

  if (match) {
    return {
      bucket: match[1], // The first captured group is the bucket name
      path: match[2], // The second captured group is the full file path
    };
  }

  return null; // Return null if the URL doesn't match the expected format
};

export const deleteFile = async (url: string) => {
  try {
    // Extract bucket name and file path from publicUrl
    const details = extractFilePathFromUrl(url);

    if (!details) return;
    const { bucket, path } = details;

    // Remove the files
    const { data, error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Error deleting file:", error.message);

      return false;
    } else {
      console.log("File deleted successfully.", data);

      return true;
    }
  } catch (err) {
    console.error("Failed to parse URL or delete file:", err);

    return false;
  }
};

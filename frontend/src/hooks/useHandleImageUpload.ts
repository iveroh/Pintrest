import { useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";

export default function useHandleImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File | null): Promise<string | null> => {
    if (!file) {
      return null;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(file);
      return uploadedUrl;
    } catch (error) {
      console.error("Failed to upload image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadImage } as const;
}
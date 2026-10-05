"use client";

import { useMutation } from "@apollo/client/react";
import {
  UploadImageDocument,
  DeleteImageDocument,
} from "@/graphql/generated";

type UploadResult = {
  url: string;
  public_id: string;
};

export function useImageUpload() {
  const [uploadImageMutation, { loading: uploading, error: uploadError }] =
    useMutation(UploadImageDocument);

  const [deleteImageMutation, { loading: deleting, error: deleteError }] =
    useMutation(DeleteImageDocument);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Could not convert file to data URL"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadImage = async (file: File): Promise<UploadResult> => {
    const dataUrl = await fileToDataUrl(file);

    const { data } = await uploadImageMutation({
      variables: { file: dataUrl },
    });

    const payload = data?.uploadImage;
    if (!payload?.url || !payload?.public_id) {
      throw new Error("Upload failed: invalid response from server");
    }

    return {
      url: payload.url,
      public_id: payload.public_id,
    };
  };

  const deleteImage = async (publicId: string): Promise<void> => {
    const { data } = await deleteImageMutation({
      variables: { publicId },
    });

    if (!data?.deleteImage?.success) {
      throw new Error("Failed to delete image");
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    uploadError,
    deleting,
    deleteError,
  };
}

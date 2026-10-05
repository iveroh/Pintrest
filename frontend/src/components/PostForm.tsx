"use client";

import { useEffect, useRef, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import beer from "../assets/beer.jpg";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { CreatePintPostDocument } from "@/graphql/generated";
import { useAuth } from "@/context/authContext";
import PostCropImage from "@/components/PostCropImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";

function PostForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { navigateTo } = useSmartNavigation();
  const {
    uploadImage,
    uploading: imageUploading,
    uploadError: hookUploadError,
  } = useImageUpload();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const [createPintPost] = useMutation(CreatePintPostDocument);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const focusFirstInDialog = useCallback(() => {
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    const focusableSelectors = [
      "button:not([disabled])",
      "[href]",
      'input:not([type="hidden"]):not([disabled])',
      "textarea:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    const focusables = dialogEl.querySelectorAll<HTMLElement>(focusableSelectors);
    if (focusables.length > 0) {
      focusables[0].focus();
    }
  }, []);

  useEffect(() => {
    previouslyFocusedElementRef.current =
      (document.activeElement as HTMLElement | null) ?? null;

    document.body.style.overflow = "hidden";

    focusFirstInDialog();

    return () => {
      document.body.style.overflow = "unset";
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [focusFirstInDialog]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isCropping) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || isCropping) return;

      const dialogEl = dialogRef.current;
      if (!dialogEl) return;

      const focusableSelectors = [
        "button:not([disabled])",
        "[href]",
        'input:not([type="hidden"]):not([disabled])',
        "textarea:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(", ");

      const focusables = Array.from(
        dialogEl.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter((el) => !el.hasAttribute("data-focus-trap-ignore"));

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!current || current === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (!current || current === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [isCropping, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isCropping) {
      const id = window.setTimeout(() => {
        focusFirstInDialog();
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, [isCropping, focusFirstInDialog]);

  useEffect(() => {
    if (!imagePreview || !imagePreview.startsWith("blob:")) return;
    return () => {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (error) {
        console.warn("Failed to revoke image preview URL", error);
      }
    };
  }, [imagePreview]);

  const formSchema = z.object({
    title: z.string().min(2).max(20),
    description: z.string().min(0).max(100),
    image_url: z.string().min(1, "Please upload an image"),
    pints: z
      .string()
      .min(1, "Required")
      .max(2, "Too many digits")
      .refine((val) => {
        const num = Number(val);
        return Number.isInteger(num) && num >= 1 && num <= 12;
      }, "Pints must be between 1 and 12"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      pints: "",
    },
  });

  const handleOpenCropper = () => {
    setUploadError(null);
    setIsCropping(true);
  };

  const handleImageCropped = async (file: File | null) => {
    if (!file) {
      setIsCropping(false);
      return;
    }
    try {
      setUploadError(null);
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue("image_url", dataUrl, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to prepare preview";
      setUploadError(msg);
    } finally {
      setIsCropping(false);
    }
  };

  async function onSubmit() {
    try {
      if (!user) {
        throw new Error("You must be logged in to post a pint.");
      }
      setUploading(true);
      setUploadError(null);

      let imageUrl = form.getValues("image_url");
      let imagePublicId = "";

      if (imageFile) {
        const { url, public_id } = await uploadImage(imageFile);
        imageUrl = url;
        imagePublicId = public_id;
        form.setValue("image_url", imageUrl, { shouldValidate: true });
      }

      await createPintPost({
        variables: {
          postData: {
            title: form.getValues("title"),
            description: form.getValues("description"),
            creator_id: user.id,
            pints_consumed: parseInt(form.getValues("pints")),
            image_url: imageUrl,
            image_public_id: imagePublicId,
          },
        },
        update(cache, { data }) {
          if (!data?.createPintPost) return;
          cache.evict({ fieldName: "getPintPosts" });
          cache.gc();
        },
      });

      onClose();
    } catch (error) {
      console.error("Error submitting post:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to submit post"
      );
    } finally {
      setUploading(false);
    }
    sessionStorage.removeItem("homeSortField");
    sessionStorage.removeItem("homeSortOrder");

    navigateTo("/");
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
      onClick={onClose} // Close the overlay when clicking outside
    >
      <div
        className="h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form content
      >
        <div
          ref={dialogRef}
          className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-form-title"
        >
          <div className="max-h-[80vh] overflow-y-auto p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 id="post-form-title" className="text-3xl font-bold">
                Post a pint!
              </h1>
              <Button
                onClick={onClose}
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                aria-label="Close post form"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {(uploadError || hookUploadError) && (
              <div
                className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                role="alert"
              >
                {uploadError || hookUploadError?.message}
              </div>
            )}

            <section className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-full md:grow md:max-w-[60%]">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter a title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Write a description..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Picture</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={handleOpenCropper}
                                disabled={uploading}
                                className="bg-white border "
                                aria-label={
                                  imagePreview
                                    ? "Change selected image"
                                    : "Select and crop image"
                                }
                              >
                                {imagePreview
                                  ? "Change image "
                                  : "Select and crop image"}
                              </Button>
                              <Input type="hidden" value={field.value} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="pints"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pints</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={12}
                              {...field}
                              aria-describedby="pints-description"
                            />
                          </FormControl>
                          <FormDescription id="pints-description">
                            How many pints champ? (1-12)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      className="w-full"
                      effect="ripple"
                      variant="default"
                      type="submit"
                      disabled={uploading || imageUploading}
                    >
                      {uploading || imageUploading ? "Uploading..." : "Submit"}
                    </Button>
                  </form>
                </Form>
              </div>

              <div className="w-full md:w-[40%] flex items-center justify-center flex-col">
                <img
                  className="w-full object-contain max-h-[300px]"
                  src={imagePreview || beer}
                  alt={
                    imagePreview
                      ? "Selected image preview for your pint post"
                      : "Default beer illustration"
                  }
                />
                <p className="text-gray-400 mt-2">
                  {imageFile ? imageFile.name : "beer.jpg"}
                </p>
              </div>

              <Dialog
                open={isCropping}
                onOpenChange={(open) => !uploading && setIsCropping(open)}
              >
                <DialogContent
                  className="sm:max-w-md flex flex-col justify-center items-center"
                  onInteractOutside={(e) => uploading && e.preventDefault()}
                >
                  <DialogHeader>
                    <DialogTitle>Select & Crop Image</DialogTitle>
                    {uploading && (
                      <DialogDescription>
                        Uploading your image, please wait...
                      </DialogDescription>
                    )}
                  </DialogHeader>
                  <div className="flex justify-center py-4 max-w-[90%]">
                    <PostCropImage onImageCropped={handleImageCropped} />
                  </div>
                </DialogContent>
              </Dialog>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostForm;

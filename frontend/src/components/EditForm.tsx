"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import beer from "../assets/beer.jpg";

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

import { useMutation, useQuery } from "@apollo/client/react";
import {
  UpdatePintPostDocument,
  GetPintPostDocument,
} from "@/graphql/generated";
import { useAuth } from "@/context/authContext";

type Props = {
  id: string;
  onClose: () => void;
};

const formSchema = z.object({
  title: z.string().min(2).max(20),
  description: z.string().min(0).max(100),
  pints: z
    .string()
    .min(1, "Required")
    .max(2, "Too many digits")
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num >= 1 && num <= 12;
    }, "Pints must be between 1 and 12"),
});

export default function EditFormModal({ id, onClose }: Props) {
  const { user } = useAuth();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const [topOffset, setTopOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    const updateOffsets = () => {
      const candidates = [
        document.getElementById("desktop-top-navbar"),
        document.getElementById("mobile-top-navbar"),
        document.getElementById("top-navbar"),
      ];

      const firstVisible = candidates.find((el) => {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
          el.offsetHeight > 0 &&
          style.display !== "none" &&
          style.visibility !== "hidden"
        );
      });

      const top = firstVisible
        ? Math.round(firstVisible.getBoundingClientRect().bottom)
        : 0;

      const bottomNavbar = document.getElementById("mobile-bottom-nav");
      const bottom =
        bottomNavbar && bottomNavbar.offsetHeight > 0
          ? Math.round(
              window.innerHeight - bottomNavbar.getBoundingClientRect().top
            )
          : 0;

      setTopOffset(Math.max(0, Math.min(top, window.innerHeight)));
      setBottomOffset(Math.max(0, Math.min(bottom, window.innerHeight)));
    };

    updateOffsets();
    window.addEventListener("resize", updateOffsets);

    const ro = new ResizeObserver(updateOffsets);
    const topElObserve =
      document.getElementById("desktop-top-navbar") ||
      document.getElementById("mobile-top-navbar") ||
      document.getElementById("top-navbar");
    const bottomElObserve = document.getElementById("mobile-bottom-nav");
    if (topElObserve) ro.observe(topElObserve);
    if (bottomElObserve) ro.observe(bottomElObserve);

    return () => {
      window.removeEventListener("resize", updateOffsets);
      ro.disconnect();
    };
  }, []);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", pints: "" },
  });

  const { data, loading, error, refetch } = useQuery(GetPintPostDocument, {
    variables: { id },
    skip: !id,
  });

  const isOwnPost = user?.id === data?.getPintPost?.creator_id;

  useEffect(() => {
    if (data?.getPintPost) {
      const p = data.getPintPost;
      form.reset({
        title: p.title,
        description: p.description,
        pints: String(p.pints_consumed ?? ""),
      });
      setImagePreview(p.image_url || null);
    }
  }, [data, form]);

  const [updatePintPost] = useMutation(UpdatePintPostDocument);

  async function onSubmit() {
    try {
      if (!user) {
        throw new Error("You must be logged in to edit posts");
      }

      if (!isOwnPost) {
        throw new Error("You can only edit your own posts");
      }

      setUploading(true);
      setUploadError(null);

      await updatePintPost({
        variables: {
          id,
          postData: {
            title: form.getValues("title"),
            description: form.getValues("description"),
            pints_consumed: parseInt(form.getValues("pints")),
          },
        },
      });

      await refetch();
      onClose();
    } catch (e) {
      console.error(e);
      setUploadError(
        e instanceof Error ? e.message : "Failed to update post"
      );
    } finally {
      setUploading(false);
    }
  }

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

    const id = window.setTimeout(() => {
      focusFirstInDialog();
    }, 0);

    return () => {
      window.clearTimeout(id);
      if (previouslyFocusedElementRef.current) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [focusFirstInDialog]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

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
      );

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
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div
          className="bg-white rounded-md p-6 shadow max-w-md"
          role="dialog"
          aria-modal="true"
          aria-label="Loading post"
        >
          <p className="text-lg">Loading post…</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.getPintPost) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div
          className="bg-white rounded-md p-6 shadow max-w-md"
          role="dialog"
          aria-modal="true"
          aria-label="Error loading post"
        >
          <p className="text-red-600 mb-4">
            {error ? `Error: ${error.message}` : "Post not found"}
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div
          className="bg-white rounded-md p-6 shadow max-w-md"
          role="dialog"
          aria-modal="true"
          aria-label="Not logged in"
        >
          <p className="text-red-600 mb-4">
            You must be logged in to edit posts
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  if (!isOwnPost) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div
          className="bg-white rounded-md p-6 shadow max-w-md"
          role="dialog"
          aria-modal="true"
          aria-label="Not allowed to edit post"
        >
          <p className="text-red-600 mb-4">
            You can only edit your own posts
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed left-0 right-0 bg-black/30 backdrop-blur-sm z-50"
      style={{ top: topOffset, bottom: bottomOffset }}
    >
      <div className="h-full flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-post-title"
        >
          <div className="max-h-[80vh] overflow-y-auto p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 id="edit-post-title" className="text-3xl font-bold">
                Edit your post
              </h1>
              <Button
                onClick={onClose}
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                aria-label="Close edit form"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {uploadError && (
              <div
                className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
                role="alert"
              >
                {uploadError}
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

                    <FormItem>
                      <FormLabel>Picture (cannot be changed)</FormLabel>
                      <div className="p-2 border rounded-md bg-gray-50">
                        <p className="text-sm text-gray-500">
                          Images cannot be edited after posting.
                        </p>
                      </div>
                    </FormItem>

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
                              aria-describedby="edit-pints-description"
                            />
                          </FormControl>
                          <FormDescription id="edit-pints-description">
                            How many pints champ? (1-12)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      className="w-full text-black hover:bg-yellow-500"
                      type="submit"
                      disabled={uploading}
                    >
                      {uploading ? "Updating..." : "Update Post"}
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
                      ? "Current image for this post"
                      : "Default beer illustration"
                  }
                />
                <p className="text-gray-400 mt-2">Current image</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

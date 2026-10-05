import { useEffect, useRef, useCallback } from "react";
import { Heart, MessageCircle, X } from "lucide-react";

import { Divider } from "@/components/ui/divider";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { Post } from "@/types/pintPostTypes";
import "@/index.css";
import { Button } from "@/components/ui/button";
import { CommentForm } from "@/components/Comment/CommentForm";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  CreateCommentDocument,
  GetCommentsDocument,
  GetUserDocument,
  GetPintPostDocument,
} from "@/graphql/generated";
import CommentSection from "@/components/Comment/CommentSection";
import { useAuth } from "@/context/authContext";
import BeerCount from "@/components/BeerCount";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { useLike } from "@/hooks/useLike";
import { IconButton } from "@/components/ui/icon-button";

interface ExploreCardProps extends Post {
  onClose: () => void;
}

export default function ExploreCard({
  post_id,
  title,
  date,
  description,
  image_src,
  creator_id,
  onClose,
}: ExploreCardProps) {
  const { handleLike, like } = useLike(post_id);
  const { user } = useAuth();
  const { navigateTo } = useSmartNavigation();

  const [createComment] = useMutation(CreateCommentDocument, {
    refetchQueries: [
      {
        query: GetCommentsDocument,
        variables: {
          postId: post_id,
        },
      },
    ],
  });

  const { data } = useQuery(GetCommentsDocument, {
    variables: {
      postId: post_id,
    },
  });

  const { data: creatorData } = useQuery(GetUserDocument, {
    variables: {
      getUserId: creator_id,
    },
  });

  const { data: postData } = useQuery(GetPintPostDocument, {
    variables: {
      id: post_id,
    },
  });

  const handleCreateComment = (description: string) => {
    try {
      if (!user) {
        throw new Error("You must be logged in to comment");
      }

      createComment({
        variables: {
          commentData: {
            description: description,
            commented_by_id: user.id,
            post_id: post_id,
          },
        },
      });
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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

  const creatorName = creatorData?.getUser?.display_name ?? "Unknown user";

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6"
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        className="relative flex w-[min(90vw,calc((90vh-6rem)*1.6))] h-[min(calc(90vw/1.6),90vh-6rem)] border-2 border-primary bg-background rounded-lg overflow-hidden transition-all duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="explore-dialog-title"
      >
        <div className="h-full w-1/2 overflow-hidden flex-shrink-0">
          <img
            src={image_src}
            alt={title || "Post image"}
            className="h-full w-full object-cover"
          />
        </div>

        <Divider orientation="vertical" flexItem />

        <Card className="h-full aspect-[4/5] p-0 gap-0 rounded-none border-none flex flex-col overflow-hidden bg-white relative">
          <CardHeader className="px-4 py-1 mb-0 flex justify-between items-start">
            <section className="flex items-center">
              <span className="mr-3">
                <Avatar
                  onClick={() =>
                    navigateTo(`/profile/${creatorData?.getUser?.id}`)
                  }
                  className="h-12 w-12 cursor-pointer"
                >
                  <AvatarImage
                    src={creatorData?.getUser?.avatar_path || undefined}
                    alt={`${creatorName}'s avatar`}
                  />
                  <AvatarFallback aria-hidden="true">
                    {creatorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </span>

              <section className="flex flex-col ml-3 pt-1">
                <CardTitle id="explore-dialog-title" className="sm:text-xl">
                  {title}
                </CardTitle>
                <span className="flex flex-row pt-1">
                  {creatorData?.getUser && (
                    <Button
                      className="p-0 mr-1 h-auto min-h-0 mt-0 align-top cursor-pointer text-black font-normal hover:bg-white hover:underline hover:underline-offset-3"
                      variant="ghost"
                      onClick={() =>
                        navigateTo(`/profile/${creatorData?.getUser?.id}`)
                      }
                    >
                      @{creatorData.getUser.display_name}
                    </Button>
                  )}
                  <CardDescription className="text-sm sm:text-base">
                    {date}
                  </CardDescription>
                </span>
              </section>
            </section>

            <Button
              onClick={onClose}
              variant="secondary"
              size="icon"
              className="cursor-pointer h-8 w-8"
              aria-label="Close post details"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <Divider />

          <CardContent>
            <CardDescription>
              <p className="text-black text-sm sm:text-base pt-1 pb-2 text-center wrap-anywhere">
                {description}
              </p>
            </CardDescription>
          </CardContent>

          <Divider />

          <CardContent className="flex-1 overflow-auto px-0 pt-0 pb-0 mt-0">
            <CommentSection commentsData={data} />
          </CardContent>

          <Divider />

          <CardContent className="mt-auto flex items-center justify-between gap-4 p-3">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 rounded-full hover:bg-secondary transition-colors"
              data-active={like}
              aria-pressed={like}
              aria-label={like ? "Unlike this post" : "Like this post"}
            >
              <IconButton
                icon={Heart}
                active={like}
                onClick={(e) => e.stopPropagation()}
                size="lg"
                animate={true}
                className="pointer-events-none"
              />
              <span className="text-base font-semibold text-foreground pr-2">
                {postData?.getPintPost?.likes || 0}
              </span>
            </button>
            <BeerCount
              count={postData?.getPintPost?.pints_consumed ?? 0}
              max={12}
            />
            <MessageCircle
              size={28}
              className="cursor-default invisible"
              aria-hidden="true"
            />
          </CardContent>

          <Divider />

          <CommentForm submitFunctionType={handleCreateComment} />
        </Card>
      </div>
    </div>
  );
}

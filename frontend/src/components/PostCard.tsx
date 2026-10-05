import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import type { Post } from "@/types/pintPostTypes";

import {
  DeletePintPostDocument,
  GetCommentsDocument,
  GetPintPostDocument,
} from "@/graphql/generated";

import {
  EditIcon,
  Heart,
  MessageCircleMore,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/client/react";
import CommentSection from "./Comment/CommentSection";
import { CommentForm } from "./Comment/CommentForm";
import { Button } from "./ui/button";
import EditFormModal from "./EditForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLike } from "@/hooks/useLike";
import BeerCount from "./BeerCount";
import ExploreCard from "@/pages/Explore/components/ExploreCard";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { useImageUpload } from "@/hooks/useImageUpload";
import useGetUser from "@/hooks/useGetUser";
import useResponsiveSize from "@/hooks/useResponsiveSize";
import useComments from "@/hooks/useComments";
import { IconButton } from "./ui/icon-button";
import "@/index.css";

function PostCard({
  post_id,
  title,
  date,
  description,
  image_src,
  creator_id,
  refreshPosts,
}: Post & { refreshPosts?: () => void }) {
  const { handleLike, like } = useLike(post_id);
  const { user } = useAuth();
  const { deleteImage } = useImageUpload();
  const { navigateTo } = useSmartNavigation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData } = useGetUser(creator_id);
  const { isMobileView } = useResponsiveSize();
  const { handleCreateComment } = useComments(post_id, user?.id || "");
  const client = useApolloClient();

  const [DeletePintPost, { loading: isDeleting }] = useMutation(
    DeletePintPostDocument,
    {
      onCompleted: () => {
        refreshPosts?.();
      },
    }
  );

  const { data: commentsData } = useQuery(GetCommentsDocument, {
    variables: {
      postId: post_id,
    },
  });

  // Fetch the post details to get creator_id
  const { data: postData } = useQuery(GetPintPostDocument, {
    variables: {
      id: post_id,
    },
  });

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPost]);

  // Check if user is the owner of the post using creator_id
  const isOwnPost =
    user?.id && postData?.getPintPost?.creator_id
      ? String(user.id) === String(postData.getPintPost.creator_id)
      : false;

  const likeCount = postData?.getPintPost?.likes ?? 0;
  const commentCount = commentsData?.getComments?.length ?? 0;

  // delete handler with auth checks
  const handleDelete = async () => {
    try {
      if (!user) {
        alert("You must be logged in to delete posts");
        setShowDeleteDialog(false);
        return;
      }

      if (!isOwnPost) {
        alert("You can only delete your own posts");
        setShowDeleteDialog(false);
        return;
      }

      const imagePublicId = postData?.getPintPost?.image_public_id;
      if (imagePublicId) {
        try {
          await deleteImage(imagePublicId);
        } catch (imageError) {
          console.error("Error deleting image from cloudinary:", imageError);
        }
      }

      const result = await DeletePintPost({
        variables: { id: String(post_id) },
      });

      if (result.data?.deletePintPost?.success) {
        try {
          const identified = client.cache.identify({
            __typename: "PintPost",
            id: String(post_id),
          });
          if (identified) {
            client.cache.evict({ id: identified });
            if (typeof client.cache.gc === "function") {
              client.cache.gc();
            }
          }
        } catch (e) {
          console.error("Cache eviction failed:", e);
        }

        setShowDeleteDialog(false);
      } else {
        console.error("Delete mutation returned success=false");
        alert("Failed to delete post. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("An error occurred while deleting the post.");
    }
  };

  const authorDisplayName = userData?.getUser?.display_name;
  const authorId = userData?.getUser?.id;

  return (
    <>
      <Card className="w-fit bg-white max-w-md">
        {/* HEADER */}
        <CardHeader className="flex items-start">
          {/* Avatar as a focusable button for accessibility */}
          <button
            type="button"
            onClick={() => {
              if (authorId) {
                navigateTo(`/Profile/${authorId}`);
                window.scrollTo({ top: 0 });
              }
            }}
            className="mr-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-full"
            aria-label={
              authorDisplayName
                ? `View profile of ${authorDisplayName}`
                : "View user profile"
            }
          >
            <Avatar className="w-16 h-16 cursor-pointer">
              <AvatarImage
                src={userData?.getUser?.avatar_path}
                alt={
                  authorDisplayName
                    ? `Profile picture of ${authorDisplayName}`
                    : "User avatar"
                }
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </button>

          {/* Title + date */}
          <div className="flex flex-col flex-1 overflow-hidden gap-1">
            <CardTitle className="sm:text-2xl text-xl flex wrap-anywhere">
              {title}
            </CardTitle>

            {/* Username and Date - improved structure */}
            <div className="flex items-center gap-2 flex-wrap">
              {userData?.getUser && (
                <>
                  <Button
                    className="p-0 h-auto min-h-0 font-semibold text-sm sm:text-base text-primary hover:text-primary/80 hover:underline hover:underline-offset-2 transition-colors"
                    variant="ghost"
                    onClick={() => authorId && navigateTo(`/profile/${authorId}`)}
                  >
                    @{userData.getUser.display_name}
                  </Button>
                  <span className="text-muted-foreground/40">•</span>
                </>
              )}
              <CardDescription className="text-xs sm:text-sm text-muted-foreground font-medium">
                {date}
              </CardDescription>
            </div>
          </div>

          {/* Dropdown menu - only visible to post owner */}
          {isOwnPost && (
            <DropdownMenu
              modal={false}
              open={isMenuOpen}
              onOpenChange={setIsMenuOpen}
            >
              <DropdownMenuTrigger asChild>
                <IconButton
                  icon={EditIcon}
                  size="lg"
                  animate={false}
                  fillOnActive={false}
                  aria-label="Open post options menu"
                  aria-haspopup="menu"
                  aria-expanded={isMenuOpen}
                  className="-top-2 -right-2"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40 space-y-1">
                {/* Edit */}
                <DropdownMenuItem asChild>
                  <Button
                    effect="none"
                    variant="ghost"
                    className="w-full justify-start gap-2 text-secondary-foreground data-highlighted:bg-primary data-highlighted:cursor-pointer"
                    onClick={() => setShowEdit(true)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </DropdownMenuItem>

                {/* Delete */}
                <DropdownMenuItem asChild>
                  <Button
                    effect="none"
                    variant="ghost"
                    className="w-full justify-start gap-2  text-red-600 data-highlighted:cursor-pointer data-highlighted:bg-red-600 data-highlighted:text-white"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 hover:text-red-100" />
                    Delete
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {/* Image: clickable on desktop, static on mobile */}
          {!isMobileView && (
            <button
              type="button"
              className="w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              onClick={() => setSelectedPost(true)}
              aria-label={`Open post details for "${title}"`}
            >
              <img
                src={image_src}
                className="w-full aspect-4/5 object-cover"
                alt={title || "Post image"}
              />
            </button>
          )}

          {isMobileView && (
            <img
              src={image_src}
              className="w-full aspect-4/5 object-cover"
              alt={title || "Post image"}
            />
          )}

          {description && (
            <CardDescription>
              <p className="px-4 pt-4 pb-2 text-lg text-black wrap-anywhere">{description}</p>
            </CardDescription>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-0">
          {/* Like button + count */}
          <section className="flex flex-row items-center min-w-[70px] justify-start">
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
              <span
                aria-live="polite"
                className="text-base font-semibold text-foreground pr-2"
              >
                {likeCount}
              </span>
            </button>
          </section>

          {/* Beer count in the middle */}
          <div className="flex items-center">
            <BeerCount
              count={postData?.getPintPost?.pints_consumed ?? 0}
              max={12}
            />
          </div>

          {/* Comments / details */}
          {isMobileView && (
            <Drawer open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
              <DrawerTrigger asChild>
                <section className="flex flex-row items-center min-w-[70px] justify-end">
                  <button className="flex items-center gap-1 rounded-full hover:bg-secondary transition-colors" data-active={isCommentsOpen}>
                    <IconButton
                      icon={MessageCircleMore}
                      active={isCommentsOpen}
                      animate={true}
                      size="lg"
                      aria-pressed={isCommentsOpen}
                      aria-label={
                        isCommentsOpen ? "Close comments" : "Open comments"
                      }
                      className="pointer-events-none"
                    />
                    <span
                      aria-live="polite"
                      className="text-base font-medium text-foreground pr-2"
                    >
                      {commentCount}
                    </span>
                  </button>
                </section>
              </DrawerTrigger>

              <DrawerContent className="mx-auto max-w-md rounded-lg border bg-background flex flex-col h-[80vh] p-3">
                <DrawerHeader className="sr-only">
                  <DrawerTitle>Comment Section</DrawerTitle>
                  <DrawerDescription>
                    Delete comments yet to be implemented
                  </DrawerDescription>
                </DrawerHeader>
                <section className="flex-1 overflow-y-auto p-4">
                  <CommentSection commentsData={commentsData} />
                </section>
                <section className="border-t p-4 bg-background">
                  <CommentForm submitFunctionType={handleCreateComment} />
                </section>
              </DrawerContent>
            </Drawer>
          )}

          {!isMobileView && (
            <section className="flex flex-row gap-1 items-center min-w-[70px]">
              <button
                onClick={() => setSelectedPost(true)}
                className="flex items-center gap-1 rounded-full hover:bg-secondary transition-colors"
                data-active={selectedPost}
                aria-pressed={selectedPost}
                aria-label={
                  selectedPost
                    ? "Close post details"
                    : "Open post details with comments"
                }
              >
                <IconButton
                  icon={MessageCircleMore}
                  active={selectedPost}
                  animate={true}
                  size="lg"
                  onClick={(e) => e.stopPropagation()}
                  className="pointer-events-none"
                />
                <span
                  aria-live="polite"
                  className="text-base font-semibold text-foreground pr-2"
                >
                  {commentCount}
                </span>
              </button>
            </section>
          )}
        </CardFooter>
      </Card>

      {selectedPost && (
        <ExploreCard
          post_id={post_id}
          title={title}
          date={date}
          description={description}
          image_src={image_src}
          creator_id={creator_id}
          onClose={() => setSelectedPost(false)}
        />
      )}

      {/* DELETE CONFIRM DIALOG */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post "{title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="hover:bg-primary"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showEdit && (
        <EditFormModal id={post_id} onClose={() => setShowEdit(false)} />
      )}
    </>
  );
}

export default PostCard;

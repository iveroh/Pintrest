import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { CommentForm } from "./CommentForm";
import useGetUser from "@/hooks/useGetUser";
import useComments from "@/hooks/useComments";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";

export default function CommentItem({
  description,
  comment_id,
  post_id,
  commented_by_id,
}: {
  description: string;
  comment_id: string;
  post_id: string;
  commented_by_id: string;
}) {
  const { navigateTo } = useSmartNavigation();
  const { user } = useAuth();
  const { userData, userDataLoading, userDataError } = useGetUser(commented_by_id);

  const displayName = userData?.getUser?.display_name ?? "Unknown User";
  const avatarSrc = userData?.getUser?.avatar_path;
  const isOwnComment = user?.id === commented_by_id;

  const {
    handleDelete,
    handleEditComment,
    isEditing,
    setIsEditing,
  } = useComments(post_id, commented_by_id);

  if (userDataLoading) {
    return (
      <section
        aria-label="Loading comment"
        className="flex flex-row p-2 gap-2 items-center text-muted-foreground"
      >
        <Avatar>
          <AvatarImage src={avatarSrc} alt="" />
        </Avatar>
        <p>Loading...</p>
      </section>
    );
  }

  if (userDataError) {
    console.error(userDataError);
    return (
      <p role="alert" className="text-red-600">
        Error loading user
      </p>
    );
  }

  return (
    <article
      className="flex flex-row shadow-sm items-center p-2 border rounded-md overflow-hidden"
      aria-label={`Comment by ${displayName}`}
    >
      {!isEditing && (
        <section
          className="flex flex-row p-2 gap-2 justify-between items-center mr-auto min-w-0"
          aria-label="Comment content"
        >
          <Avatar>
            <AvatarImage
              src={avatarSrc}
              alt={`${displayName}'s profile picture`}
              className="cursor-pointer"
              onClick={() => navigateTo(`/Profile/${userData?.getUser?.id}`)}
            />
          </Avatar>

          <span className="flex-1 flex flex-col min-w-0">
            <button
              onClick={() => navigateTo(`/Profile/${userData?.getUser?.id}`)}
              className="cursor-pointer font-bold truncate text-left hover:underline"
              title={displayName}
              aria-label={`View profile of ${displayName}`}
            >
              {displayName}
            </button>

            <p className="text-sm text-gray-700 break-words">{description}</p>
          </span>
        </section>
      )}

      {isEditing && (
        <section
          className="flex flex-row p-2 gap-2 justify-between items-center mr-auto"
          aria-label={`Editing comment by ${displayName}`}
        >
          <Avatar>
            <AvatarImage
              src={avatarSrc}
              alt={`${displayName}'s profile picture`}
            />
          </Avatar>

          <span className="flex-1 flex flex-col">
            <h1 className="font-bold truncate" title={displayName}>
              {displayName}
            </h1>

            <CommentForm
              previousDescription={description}
              submitFunctionType={(newDescription) =>
                handleEditComment(newDescription, comment_id)
              }
            />
          </span>
        </section>
      )}

      {isOwnComment && (
        <section aria-label="Comment actions">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                effect="ripple"
                aria-label="Open actions menu for this comment"
                className="icon-sm"
              >
                <MoreHorizontalIcon className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-40 space-y-1"
              aria-label="Comment options"
            >
              <DropdownMenuItem asChild>
                <Button
                  effect="none"
                  variant="secondary"
                  className="w-full justify-start gap-2 bg-white data-[highlighted]:bg-primary data-[highlighted]:cursor-pointer"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit comment"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Button
                  effect="none"
                  variant="secondary"
                  className="
                    w-full justify-start gap-2
                    !text-red-600
                    bg-white
                    data-[highlighted]:cursor-pointer
                    data-[highlighted]:bg-red-600
                    data-[highlighted]:!text-white
                  "
                  onClick={() => handleDelete(comment_id)}
                  aria-label="Delete this comment"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      )}
    </article>
  );
}

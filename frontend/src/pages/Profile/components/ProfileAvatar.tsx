import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/graphql/generated";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useMutation } from "@apollo/client/react";
import { UpdateUserProfileDocument } from "@/graphql/generated";
import { useState } from "react";
import AvatarCropImage from "@/components/AvatarCropImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { EditIcon } from "lucide-react";

function ProfileAvatar({ isOwnProfile, user }: { isOwnProfile: boolean; user: User }) {
  const [updateUserProfile] = useMutation(UpdateUserProfileDocument);
  const [isEditing, setIsEditing] = useState(false);
  const { uploading, uploadImage, deleteImage } = useImageUpload();

  const handleAvatarClick = () => {
    if (isOwnProfile && !isEditing && !uploading) {
      setIsEditing(true);
    }
  };

  const handleImageCropped = async (file: File | null) => {
    if (!file) {
      setIsEditing(false);
      return;
    }

    try {
      const result = await uploadImage(file);
      const avatarUrl = result.url;
      const avatar_public_id = result.public_id;

      if (avatarUrl) {
        const oldPublicId = user.avatar_public_id;

        await updateUserProfile({
          variables: {
            userId: user.id,
            profileData: {
              avatar_path: avatarUrl,
              avatar_public_id,
            },
          },
          refetchQueries: ["GetUser"],
        });

        if (oldPublicId) {
          try {
            await deleteImage(oldPublicId);
          } catch (error) {
            console.error("Failed to delete old avatar:", error);
          }
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div>
        {isOwnProfile ? (
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-background shadow-md bg-white hover:scale-100 active:scale-100">
              <AvatarImage
                src={user.avatar_path}
                alt={`Profile picture of ${user.display_name}`}
              />
            </Avatar>
            <IconButton
              icon={EditIcon}
              onClick={handleAvatarClick}
              size="md"
              color={[0, 0, 0]}
              aria-label="Edit profile avatar"
              className="absolute -bottom-1 -right-1 z-1 shadow-lg border-2 border-white bg-primary hover:bg-primary active:bg-primary"
            />
          </div>
        ) : (
          <Avatar className="h-28 w-28 border-4 border-background shadow-md bg-white">
            <AvatarImage
              src={user.avatar_path}
              alt={`Profile picture of ${user.display_name}`}
            />
          </Avatar>
        )}
      </div>

      <Dialog
        open={isEditing}
        onOpenChange={(open) => !uploading && setIsEditing(open)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => uploading && e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
            {uploading && (
              <DialogDescription>
                Uploading your avatar, please wait...
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="flex justify-center py-4">
            <AvatarCropImage onImageCropped={handleImageCropped} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { ProfileAvatar };

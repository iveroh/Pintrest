import { useState } from "react";
import BannerCropImage from "./BannerCropImage";
import type { User } from "@/graphql/generated";
import { useMutation } from "@apollo/client/react";
import { UpdateUserProfileDocument } from "@/graphql/generated";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import banner from "@/assets/bannerimage.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useImageUpload } from "@/hooks/useImageUpload";
import { IconButton } from "@/components/ui/icon-button";
import { EditIcon } from "lucide-react";

function Banner({ isOwnProfile, user }: { isOwnProfile: boolean; user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const { uploading, uploadImage, deleteImage } = useImageUpload();
  const [updateUserProfile] = useMutation(UpdateUserProfileDocument);

  const handleBannerEdit = () => {
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
      const bannerUrl = result.url;
      const banner_public_id = result.public_id;

      if (bannerUrl) {
        const oldPublicId = user.banner_public_id;

        await updateUserProfile({
          variables: {
            userId: user.id,
            profileData: {
              banner_path: bannerUrl,
              banner_public_id,
            },
          },
          refetchQueries: ["GetUser"],
        });

        if (oldPublicId) {
          try {
            await deleteImage(oldPublicId);
          } catch (error) {
            console.error("Failed to delete old banner:", error);
          }
        }
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to upload banner:", error);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative">
      <AspectRatio ratio={4 / 1}>
        <img
          src={user.banner_path || banner}
          alt={`Profile banner for ${user.display_name}`}
          className="h-full w-full rounded-md object-cover bg-secondary"
        />
      </AspectRatio>

      {isOwnProfile ? (
        <IconButton
          icon={EditIcon}
          onClick={handleBannerEdit}
          size="md"
          color={[0, 0, 0]}
          aria-label="Edit profile banner"
          className="absolute -bottom-1 -right-1 z-1 shadow-lg border-2 border-white bg-primary hover:bg-primary active:bg-primary"
        />
      ) : null}

      <Dialog
        open={isEditing}
        onOpenChange={(open) => !uploading && setIsEditing(open)}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => uploading && e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Profile Banner</DialogTitle>
            {uploading && (
              <DialogDescription>
                Uploading your banner, please wait...
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="flex justify-center py-4">
            <BannerCropImage onImageCropped={handleImageCropped} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { Banner };

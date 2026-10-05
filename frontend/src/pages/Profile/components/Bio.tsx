import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { User } from "@/graphql/generated";
import { useMutation } from "@apollo/client/react";
import { UpdateUserProfileDocument } from "@/graphql/generated";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { EditIcon } from "lucide-react";

function Bio({
  user,
  profileUserId,
  currentUserId,
}: {
  user: User;
  profileUserId: string | null;
  currentUserId: string | undefined;
}) {
  const [editMode, setEditMode] = useState(false);
  const [bioText, setBioText] = useState(user.bio || "");
  const [updateUserProfile] = useMutation(UpdateUserProfileDocument);

  const isOwnProfile = currentUserId && currentUserId === profileUserId;

  const handleEditToggle = () => {
    if (editMode) {
      // Reset to original bio when canceling edit
      setBioText(user.bio || "");
    }
    setEditMode(!editMode);
  };

  const saveBio = (newBio: string) => {
    updateUserProfile({
      variables: {
        userId: user.id,
        profileData: {
          bio: newBio,
        },
      },
      refetchQueries: ["GetUser"],
    })
      .then((response) => {
        console.log("Bio updated successfully:", response.data);
        if (response.data?.updateUserProfile?.bio !== undefined) {
          setBioText(response.data.updateUserProfile.bio);
        }
        setEditMode(false);
      })
      .catch((error) => {
        console.error("Error updating bio:", error);
        setEditMode(false);
      });
  };

  return (
    <Card className="rounded-xl shadow-sm border bg-card max-w-full overflow-hidden hover:cursor-default">
      <CardHeader className="relative">
        <CardTitle className="text-center text-2xl font-semibold">
          Bio
        </CardTitle>
        {isOwnProfile && (
          <IconButton
            icon={EditIcon}
            onClick={handleEditToggle}
            size="md"
            aria-label="Edit bio"
            className="absolute -top-2 right-3"
          />
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-center overflow-hidden">
        <hr className="border-t border-secondary" />

        {editMode && isOwnProfile ? (
          <>
            <label htmlFor="bio-editor" className="sr-only">
              Edit bio
            </label>
            <textarea
              id="bio-editor"
              className="w-full h-24 p-2 border rounded-md resize-none wrap-break-word whitespace-pre-wrap"
              rows={3}
              value={bioText}
              onChange={(e) => {
                const newValue = e.target.value;
                const lineCount = (newValue.match(/\n/g) || []).length + 1;
                if (lineCount <= 3) {
                  setBioText(newValue);
                }
              }}
              onKeyDown={(e) => {
                const lineCount = (bioText.match(/\n/g) || []).length + 1;
                if (e.key === "Enter" && lineCount >= 3) {
                  e.preventDefault();
                }
              }}
              maxLength={200}
            />
            <Button
              onClick={() => saveBio(bioText)}
              aria-label="Save bio"
              className="align-middle mb-0"
              effect="ripple"
              variant="secondary"
            >
              Save bio
            </Button>
          </>
        ) : (
          <section className="text-lg italic wrap-break-word whitespace-pre-wrap overflow-wrap-anywhere">
            {bioText
              ? bioText
              : "This user has not set up a bio yet."}
          </section>
        )}
      </CardContent>
    </Card>
  );
}

export { Bio };

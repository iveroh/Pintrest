"use client"

import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import {
  CreateFollowerDocument,
  DeleteFollowerDocument,
  GetFollowedUsersDocument,
  type User,
} from "@/graphql/generated";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "@/context/authContext";
import { useFollowing } from "@/hooks/useFollowing";

export default function FriendButton({ profile_user }: { profile_user: User }) {
  const { user } = useAuth();
  const [createFollower] = useMutation(CreateFollowerDocument);
  const [deleteFollower] = useMutation(DeleteFollowerDocument);
  const { following } = useFollowing();

  const isFollowing = following.includes(profile_user.id);
  const profileName = profile_user.display_name ?? profile_user.username;

  const handleAddFriend = async () => {
    if (!user) {
      toast("Must be logged in to follow");
      return;
    }

    try {
      await createFollower({
        variables: {
          followerData: {
            user_id: user.id,
            following_id: profile_user.id,
          },
        },
        refetchQueries: [GetFollowedUsersDocument],
        update(cache) {
          cache.evict({ fieldName: "getPintPosts" });
          cache.gc();
        },
      });
      toast("Added to following");
    } catch (e) {
      toast("Error adding user to following");
      console.error(e);
    }
  };

  const handleUnfollow = async () => {
    if (!user) {
      toast("Must be logged in to unfollow");
      return;
    }

    try {
      await deleteFollower({
        variables: {
          followerData: {
            user_id: user.id,
            following_id: profile_user.id,
          },
        },
        refetchQueries: [GetFollowedUsersDocument],
        update(cache) {
          cache.evict({ fieldName: "getPintPosts" });
          cache.gc();
        },
      });
      toast("Unfollowed");
    } catch (e) {
      toast("Error unfollowing");
      console.error(e);
    }
  };

  const handleClick = () => {
    if (isFollowing) {
      void handleUnfollow();
    } else {
      void handleAddFriend();
    }
  };

  return (
    <Button
      className="cursor-pointer"
      variant={isFollowing ? "secondary" : "default"}
      effect="ripple"
      type="button"
      onClick={handleClick}
      aria-pressed={isFollowing}
    >
      {isFollowing ? "Unfollow" : "Follow"}
      <span className="sr-only">
        {" "}
        {profileName ? `@${profileName}` : "this user"}
      </span>
    </Button>
  );
}

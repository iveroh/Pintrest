import "@/index.css";

import PostCard from "@/components/PostCard";
import { Bio } from "./components/Bio";
import { Banner } from "./components/Banner";
import { PintStats } from "./components/PintStats";
import { PintBadges } from "./components/PintBadges";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { useQuery } from "@apollo/client/react";
import { useAuth } from "@/context/authContext";
import { useParams } from "react-router-dom";
import { GetPintPostsForUserDocument } from "@/graphql/generated";
import { formatRelativeTime } from "@/lib/utils";

import FriendButton from "./components/FriendButton";
import useGetUser from "@/hooks/useGetUser";

function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();

  const profileUserId = userId || currentUser?.id;
  const isOwnProfile = currentUser?.id === profileUserId;

  const { userData, userDataLoading, userDataError } = useGetUser(profileUserId ?? "");

  const { data: postData } = useQuery(
    GetPintPostsForUserDocument,
    {
      variables: {
        getPintPostsForUserId: profileUserId ?? "",
      },
      skip: !profileUserId,
    }
  );

  if (!profileUserId) {
    return (
      <main className="p-16 flex items-center justify-center" aria-label="User profile">
        <p className="text-xl">No user ID available</p>
      </main>
    );
  }

  const user = userData?.getUser;

  if (userDataLoading) {
    return (
      <main className="p-16 flex items-center justify-center" aria-label="User profile">
        <p className="text-xl">Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-16 flex items-center justify-center" aria-label="User profile">
        <p className="text-xl">User not found</p>
      </main>
    );
  }

  if (userDataError) {
    return (
      <main className="p-16 flex items-center justify-center" aria-label="User profile">
        <p className="text-xl text-red-500">
          Error loading profile: {userDataError.message}
        </p>
      </main>
    );
  }

  return (
    <main className="p-4 pt-16 sm:p-16" aria-label="User profile">
      <div className="mx-auto w-full lg:w-4/5 relative">
        <Banner isOwnProfile={isOwnProfile} user={user} />

        <div className="relative left-1/2 bottom-0 translate-x-[-50%] -translate-y-1/4 sm:-translate-y-1/3 md:-translate-y-1/2 flex flex-col items-center text-center">
          <ProfileAvatar isOwnProfile={isOwnProfile} user={user} />

          <div className="flex items-baseline space-x-2">
            <h1 className="text-xl font-bold">{user.display_name}</h1>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>

          <p className="text-sm italic text-center text-muted-foreground pb-2">
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </p>
          {!isOwnProfile && <FriendButton profile_user={user} />}
        </div>
      </div>

      <div className="mx-auto w-11/12 lg:w-4/5 py-6 grid grid-cols-1 lg:grid-cols-[4fr_7fr_4fr] gap-8">
        {/* Pint Stats */}
        <PintStats userId={profileUserId} />

        {/* Bio */}
        <Bio user={user} profileUserId={profileUserId} currentUserId={currentUser?.id} />

        {/* Pint Badges */}
        <PintBadges userId={profileUserId} />
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-10 items-center w-11/12 md:w-4/5 py-6 mx-auto">
        {postData && postData.getPintPostsForUser.length > 0 ? (
          postData.getPintPostsForUser.map((post) => (
            <PostCard
              key={post.id}
              post_id={post.id}
              title={post.title}
              image_src={post.image_url}
              creator_id={post.creator_id}
              date={formatRelativeTime(post.created_at)}
              description={post.description}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}

export default Profile;

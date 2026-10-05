import { useAuth } from "@/context/authContext";
import { GetFollowedUsersDocument } from "@/graphql/generated";
import { useQuery } from "@apollo/client/react";


export function useFollowing() {

    const { user } = useAuth();
    const { data, loading, error } = useQuery(GetFollowedUsersDocument, {
        variables: {
            user_id: user?.id ?? "",
        },
    
        skip: !user,
    })

    return { following: data?.getFollowedUsers.map((follower) => follower.following_id)  ?? [], loading, error }


}
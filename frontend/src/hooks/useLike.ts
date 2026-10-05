
import { useAuth } from "@/context/authContext";
import { CreateLikeDocument, DeleteLikeDocument, GetPintPostDocument } from "@/graphql/generated";
import { useMutation } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";



export function useLike(post_id: string) {

    
    const [like, setLike] = useState(true);
    const { user } = useAuth();
    const createMutationCalled = useRef(false);
    const deleteMutationCalled = useRef(false);
    
    const [createLike] = useMutation(CreateLikeDocument, {
        refetchQueries: [
            {
                query: GetPintPostDocument,
                variables: { id: post_id }
            }
        ],
        awaitRefetchQueries: false,
    });

    const [deleteLike] = useMutation(DeleteLikeDocument, {
        refetchQueries: [
            {
                query: GetPintPostDocument,
                variables: { id: post_id }
            }
        ],
        awaitRefetchQueries: false,
    });

    useEffect(() => {
        if (user) {
            setLike(isLiked(user.id, post_id))
        }
    }, [user, post_id])

    // Listen for like changes from other component instances (used to sync explorecard and postcard components)
    useEffect(() => {
        const handleLikeChange = (event: Event) => {
            const detail = (event as CustomEvent<{ post_id: string; liked: boolean }>).detail;
            if (detail?.post_id === post_id && user) {
                setLike(isLiked(user.id, post_id));
            }
        };

        window.addEventListener('likeChanged', handleLikeChange as EventListener);
        return () => {
            window.removeEventListener('likeChanged', handleLikeChange as EventListener);
        };
    }, [post_id, user]);



    // handleLike uses useRef to guard against double rendering in development mode (It would create double like entries if not
    // as react renders state components twice to check for errors in development mode).
    const handleLike = async () => {
        try {
            if (!user) {
                throw new Error("You must be logged in to like posts");
            }

            const liked = toggleLikes(user.id, post_id);
            setLike(liked);

            window.dispatchEvent(new CustomEvent('likeChanged', {
                detail: { post_id, liked }
            }));

            if (liked && !createMutationCalled.current) {
                await createLike({
                    variables: {
                        likeData: {
                            liked_by_id: user.id,
                            post_id: post_id,
                        },
                    },
                });

                // mark that create mutation has been called
                createMutationCalled.current = true;
            }

            if (!liked && !deleteMutationCalled.current) {
                console.log("unliked");
                await deleteLike({
                    variables: {
                        post_id: post_id,
                        liked_by_id: user.id
                    }
                });
                // mark that delete mutation has been called
                deleteMutationCalled.current = true;
            }

            // Reset refs for next renders
            if (liked && createMutationCalled.current) {
                createMutationCalled.current = false;
            }
            if (!liked && deleteMutationCalled.current) {
                deleteMutationCalled.current = false;
            }
        } catch (error) {
            console.error("Error handling like:", error);
        }
    };
    return { handleLike, like }
}


// Returns a list of IDs for posts that have been liked by this user
function getLikes(user_id: string) {
  const storedLikes = localStorage.getItem(user_id);
  return storedLikes ? JSON.parse(storedLikes) : [];
}

function saveLikes(user_id: string, Likes: number[]) {
    localStorage.setItem(user_id, JSON.stringify(Likes));
}

// Called when user clicks on like button, removes or adds post to liked posts.
function toggleLikes(user_id: string, post_id: string) {
  const likes = getLikes(user_id);

  // Remove like if already liked
  if (likes.includes(post_id)) {
    const updatedLikes = likes.filter((id: string) => id !== post_id);
    saveLikes(user_id, updatedLikes);
    return false;
  } else {
    // Add like if not already liked
    const updatedLikes = [...likes, post_id];
    saveLikes(user_id, updatedLikes);
    return true;
  }
}

function isLiked(user_id: string, post_id: string) {
  const likes = getLikes(user_id);
  return likes.includes(post_id);
}

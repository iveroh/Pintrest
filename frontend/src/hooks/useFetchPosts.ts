import { GetPintPostsDocument, type PintPostSortOrder, type SortOrder, type GetPintPostsQuery } from "@/graphql/generated";
import { useQuery } from "@apollo/client/react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useFollowing } from "./useFollowing";
import { useAuth } from "@/context/authContext";

type SortField = keyof PintPostSortOrder;
type PintPost = GetPintPostsQuery["getPintPosts"]["posts"][number];


export default function useFetchPosts(homepage: boolean, take?: number, searchQuery?: string, sortField?: SortField, sortOrder?: SortOrder) {
    const ALWAYS_INCLUDE_USER = "cmi990uw0002nh1woiy626h77";
    const { user } = useAuth();
    const { following } = useFollowing();
    const [posts, setPosts] = useState<PintPost[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [fetchingMore, setFetchingMore] = useState(false);

    // Create the list of creator IDs to filter by (only for homepage)
    const creatorIds = useMemo(() => {
        if (!homepage) return undefined;
        const ids = [...following, ALWAYS_INCLUDE_USER];
        if (user?.id) ids.push(user.id);
        return ids;
    }, [homepage, following, user?.id]);

    const { data, loading, error, fetchMore, refetch } = useQuery(GetPintPostsDocument, {
        variables: {
            orderBy: sortField && sortOrder ? { [sortField]: sortOrder } : undefined,
            take: take,
            search: searchQuery,
            creatorIds: creatorIds,
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "cache-and-network",
    });   

    useEffect(() => {
        if (!data?.getPintPosts) return;

        // Only set posts on initial load or when filters change
        // Don't set posts when fetchingMore is true (pagination)
        if (!fetchingMore) {
            const seenIds = new Set<string>();
            const dedupedPosts = data.getPintPosts.posts.filter((post: PintPost) => {
                if (seenIds.has(post.id)) return false;
                seenIds.add(post.id);
                return true;
            });

            setPosts(dedupedPosts);
            setCursor(data.getPintPosts.nextCursor ?? null);
        }
    }, [data, searchQuery, sortField, sortOrder, homepage, fetchingMore]);

    const loadMorePosts = useCallback(async () => {
        if (cursor && !fetchingMore) {
            setFetchingMore(true);
            const { data: moreData } = await fetchMore({
            variables: {
                cursor,
                orderBy: sortField && sortOrder ? { [sortField]: sortOrder } : undefined, 
                take: take,
                creatorIds: creatorIds,
            },
            });
            if (moreData?.getPintPosts.posts.length) {
                setPosts((prev) => [...prev, ...moreData.getPintPosts.posts]);
                setCursor(moreData.getPintPosts.nextCursor ?? null);
            } else {
                setCursor(null);
            }
            setFetchingMore(false);
        }
    }, [cursor, fetchMore, fetchingMore, sortField, sortOrder, take, creatorIds]);

    return { posts, loading, error, loadMorePosts, hasMore: !!cursor, fetchingMore, refetch};
}

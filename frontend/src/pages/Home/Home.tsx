import PostCard from "@/components/PostCard";
import { useState, useRef, useEffect } from "react";
import { type SortOrder, type PintPostSortOrder } from "@/graphql/generated";
import { useSearchParams } from "react-router-dom";
import useFetchPosts from "@/hooks/useFetchPosts";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import NoPostsFound from "../Profile/components/NoPostsFound";
import PostCardSkeleton from "@/components/PostCardSkeleton";
import FilteringDropdown from "../../components/FilteringDropdown";
import { SearchBar } from "@/components/Navbar/SearchBar";
import { formatRelativeTime } from "@/lib/utils";

type SortField = keyof PintPostSortOrder;

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || undefined;
  const [sortField, setSortField] = useState<SortField>(sessionStorage.getItem("homeSortField") as SortField || "created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>(sessionStorage.getItem("homeSortOrder") as SortOrder || "desc");

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const {
    posts,
    loading,
    error,
    loadMorePosts,
    hasMore,
    fetchingMore,
    refetch,
  } = useFetchPosts(true, 5, searchQuery, sortField, sortOrder);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll(loaderRef, hasMore, fetchingMore, loadMorePosts);

  useEffect(() => {
    if (sortField === "likes") {
      refetch();
    }
  }, [sortField, sortOrder, refetch]);

  return (
    <>
      <main
        id="main-content"
        aria-busy={loading || fetchingMore ? "true" : "false"}
        className="no-scrollbar p-4 pt-20 lg:p-20 flex flex-col gap-10 items-center"
      >
        <h1 className="sr-only">Home – Latest pint posts</h1>

        <section
          aria-label="Search and filter tools"
          className="w-full max-w-md flex flex-wrap items-center gap-4 justify-center md:justify-between"
        >
          <SearchBar />

          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <FilteringDropdown
              sortFieldValue={sortField}
              sortOrderValue={sortOrder}
              onSortFieldChange={setSortField}
              onSortOrderChange={setSortOrder}
              homepage={true}
            />
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="max-w-md text-center text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded"
          >
            Something went wrong while loading posts.
          </div>
        )}

        {/* No results */}
        {!loading && posts.length === 0 && !error && (
          <section aria-label="No posts found">
            <NoPostsFound onReset={handleResetFilters} />
          </section>
        )}

        <section
          aria-label="List of posts"
          className="flex flex-col gap-10 mb-20"
        >
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <PostCardSkeleton key={index} />
            ))}

          <ul className="flex flex-col gap-10">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard
                  post_id={post.id}
                  title={post.title}
                  image_src={post.image_url}
                  creator_id={post.creator_id}
                  date={formatRelativeTime(post.created_at)}
                  description={post.description}
                  refreshPosts={refetch}
                />
              </li>
            ))}
          </ul>

          <div
            ref={loaderRef}
            className="h-10 text-center"
            aria-live="polite"
            role="status"
          >
            {fetchingMore && <PostCardSkeleton />}
          </div>
        </section>
      </main>
    </>
  );
}

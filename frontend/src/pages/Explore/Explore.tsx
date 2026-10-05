import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { ImageListItem } from "@/components/ui/image-list";
import ExploreCard from "./components/ExploreCard";
import PostCard from "@/components/PostCard";
import NoPostsFound from "../Profile/components/NoPostsFound";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Post } from "@/types/pintPostTypes";
import useFetchPosts from "@/hooks/useFetchPosts";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import useResponsiveSize from "@/hooks/useResponsiveSize";
import { useSearchParams } from "react-router-dom";
import { type SortOrder, type PintPostSortOrder } from "@/graphql/generated";
import FilteringDropdown from "../../components/FilteringDropdown";
import { SearchBar } from "@/components/Navbar/SearchBar";
import ExploreListItemSkeleton from "./components/ExploreListItemSkeleton";
import { formatRelativeTime } from "@/lib/utils";

type SortField = keyof PintPostSortOrder;

export default function Explore() {
  const { user } = useAuth();
  const handleMobileBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedPost(null);
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || undefined;

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { isMobileView } = useResponsiveSize();

  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (sessionStorage.getItem("exploreSortOrder") as SortOrder) || "desc"
  );
  const [sortField, setSortField] = useState<SortField>(
    (sessionStorage.getItem("exploreSortField") as SortField) || "created_at"
  );

  const {
    posts,
    loading,
    error,
    loadMorePosts,
    hasMore,
    fetchingMore,
  } = useFetchPosts(false, 10, searchQuery, sortField, sortOrder);

  useInfiniteScroll(loaderRef, hasMore, fetchingMore, loadMorePosts);

  const handleResetFilters = () => {
    setSearchParams({});
  };

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPost]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedPost) return; 

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const tagName = target.tagName.toLowerCase();
      const isEditable =
        ["input", "textarea", "select", "button"].includes(tagName) ||
        target.isContentEditable;

      if (isEditable) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        window.scrollBy({
          top: window.innerHeight * 0.9,
          behavior: "smooth",
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        window.scrollBy({
          top: -window.innerHeight * 0.9,
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost]);

  const mobileDialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedPost || !isMobileView) return;

    previousFocusRef.current =
      (document.activeElement as HTMLElement | null) ?? null;

    const dialogEl = mobileDialogRef.current;
    if (dialogEl) {
      const focusableSelectors = [
        "button:not([disabled])",
        "[href]",
        'input:not([type="hidden"]):not([disabled])',
        "textarea:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(", ");

      const focusables =
        dialogEl.querySelectorAll<HTMLElement>(focusableSelectors);
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mobileDialogRef.current) return;

      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedPost(null);
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = mobileDialogRef.current;
      const focusableSelectors = [
        "button:not([disabled])",
        "[href]",
        'input:not([type="hidden"]):not([disabled])',
        "textarea:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
      ].join(", ");

      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelectors)
      );

      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!current || current === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (!current || current === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [selectedPost, isMobileView]);

  const openPost = (item: {
    id: string;
    title: string;
    created_at: string;
    description: string;
    image_url: string;
    creator_id: string;
  }) => {
    setSelectedPost({
      post_id: item.id,
      title: item.title,
      date: formatRelativeTime(item.created_at),
      description: item.description,
      image_src: item.image_url,
      creator_id: item.creator_id,
    });
  };

  const cardsContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selectedPost) return; 

    let scrollTimeout: number | undefined;

    const handleScroll = () => {
      if (scrollTimeout !== undefined) {
        window.clearTimeout(scrollTimeout);
      }

      scrollTimeout = window.setTimeout(() => {
        const container = cardsContainerRef.current;
        if (!container) return;

        const cards = container.querySelectorAll<HTMLElement>(
          '[data-explore-card="true"]'
        );
        if (!cards.length) return;

        const viewportBottom = window.innerHeight;

        const topSafeOffset = 80;

        for (const card of cards) {
          const element = card as HTMLElement;
          const rect = element.getBoundingClientRect();
          const isVerticallyVisible =
            rect.bottom > topSafeOffset && rect.top < viewportBottom;
          if (isVerticallyVisible) {
            if (typeof element.focus === "function") {
              try {
                element.focus({ preventScroll: true });
              } catch {
                element.focus();
              }
            }
            break;
          }
        }
      }, 180); 
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout !== undefined) {
        window.clearTimeout(scrollTimeout);
      }
    };
  }, [selectedPost]);
  const isOwnSelectedPost = !!selectedPost && !!user && selectedPost.creator_id === user.id;
  return (
    <>
      <main
        id="explore-main"
        className="no-scrollbar p-4 pt-20 lg:p-20 flex flex-col gap-10 items-center"
        aria-busy={loading || fetchingMore ? "true" : "false"}
      >
        <h1 className="sr-only">Explore pint posts</h1>

        <nav
          className="w-full max-w-md flex flex-wrap items-center gap-4 justify-center md:justify-between"
          aria-label="Search and filter posts"
        >
          <SearchBar />

          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <FilteringDropdown
              sortFieldValue={sortField}
              sortOrderValue={sortOrder}
              onSortFieldChange={setSortField}
              onSortOrderChange={setSortOrder}
              homepage={false}
            />
          </div>
        </nav>

        {error && (
          <div
            className="p-4 max-w-md text-center text-sm text-red-700 bg-red-50 border border-red-200 rounded"
            role="alert"
          >
            Error: {error.message}
          </div>
        )}

        {!posts.length && !loading && !error && (
          <section aria-label="No posts found" className="w-full flex justify-center">
            <NoPostsFound onReset={handleResetFilters} />
          </section>
        )}

        <section
          ref={cardsContainerRef}
          aria-label="Explore posts grid"
          className="
            grid 
            gap-2
            sm:gap-3
            md:gap-4
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
          "
          role="list"
        >
          {loading &&
            Array.from({ length: 10 }).map((_, i) => (
              <ExploreListItemSkeleton key={i} />
            ))}

          {posts.map((item) => (
            <ImageListItem
              key={item.id}
              role="listitem"
              data-explore-card="true"
              className="cursor-pointer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              tabIndex={0}
              onClick={() => openPost(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPost(item);
                }
              }}
              aria-label={`View post: ${item.title}`}
            >
              <div className="w-full aspect-4/5 overflow-hidden rounded-md">
                <img
                  src={`${item.image_url}?fit=crop&auto=format`}
                  alt={item.title || "Pint image"}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </ImageListItem>
          ))}

          {fetchingMore &&
            Array.from({ length: 10 }).map((_, i) => (
              <ExploreListItemSkeleton key={`loading-${i}`} />
            ))}
        </section>

        <div ref={loaderRef} className="h-10" />

        {selectedPost && !isMobileView && (
          <ExploreCard
            post_id={selectedPost.post_id}
            title={selectedPost.title}
            date={selectedPost.date}
            description={selectedPost.description}
            image_src={selectedPost.image_src}
            creator_id={selectedPost.creator_id}
            onClose={() => setSelectedPost(null)}
          />
        )}

        {selectedPost && isMobileView && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pl-1 pr-1"
            onClick={handleMobileBackdropClick}
          >
            {isOwnSelectedPost && (
              <Button
                onClick={(e) => {
                  e.stopPropagation(); 
                  setSelectedPost(null);
                }}
                variant="ghost"
                size="icon"
                className="cursor-pointer absolute top-3 right-3 text-muted-foreground h-8 w-8 bg-primary hover:bg-primary/90 z-50"
                aria-label="Close post"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div
              ref={mobileDialogRef}
              className="
                relative overflow-auto
                max-h-[calc(100svh-2rem)]
                max-w-[500px]
                bg-background
                rounded-lg
              "
            >
              {!isOwnSelectedPost && (
                <Button
                  onClick={() => setSelectedPost(null)}
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer absolute top-3 right-3 text-muted-foreground h-8 w-8 bg-primary hover:bg-primary/90 z-20"
                  aria-label="Close post"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <PostCard
                title={selectedPost.title}
                date={selectedPost.date}
                description={selectedPost.description}
                image_src={selectedPost.image_src}
                post_id={selectedPost.post_id}
                creator_id={selectedPost.creator_id}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

import { useEffect } from "react";

export default function useInfiniteScroll(loaderRef: React.RefObject<HTMLElement | null>, hasMore: boolean, fetchingMore: boolean, loadMore: () => void) {

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !fetchingMore) {
          loadMore();
        }
      },
      { root: null,          
        rootMargin: "50px", 
        threshold: 0,
      }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();

  }, [loaderRef, hasMore, fetchingMore, loadMore]);
}

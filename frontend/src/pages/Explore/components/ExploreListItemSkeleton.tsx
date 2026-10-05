import { Skeleton } from "@/components/ui/skeleton";
import { ImageListItem } from "@mui/material";

function ExploreListItemSkeleton() {
  return (
    <ImageListItem role="presentation" aria-hidden="true">
      <div className="w-full aspect-4/5 overflow-hidden rounded-md">
        <Skeleton className="w-full h-full rounded-md" aria-hidden="true" />
      </div>
    </ImageListItem>
  );
}

export default ExploreListItemSkeleton;

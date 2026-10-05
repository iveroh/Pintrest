import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

function PostCardSkeleton() {
    return (
        <Card className="w-[446px] bg-[#fcfcfc] max-w-md">
            {/* HEADER - Avatar + Title in flex row */}
            <CardHeader className="flex flex-row items-start gap-4">
                {/* Avatar skeleton */}
                <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                
                {/* Title + username + date skeleton */}
                <div className="flex flex-col flex-1 gap-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {/* Image skeleton - maintaining 4:5 aspect ratio */}
                <Skeleton className="w-full aspect-[4/5]" />
                
                {/* Description skeleton */}
                <div className="p-4 pb-0">
                    <Skeleton className="h-4 w-full mb-2" />
                </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center px-4 pt-0">
                {/* Like button + count skeleton */}
                <div className="flex flex-row gap-1 items-center">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <Skeleton className="h-4 w-6" />
                </div>

                {/* Beer bottles skeleton - simple bar */}
                <Skeleton className="h-12 w-64" />

                {/* Comment button skeleton */}
                <Skeleton className="w-12 h-12 rounded-full" />
            </CardFooter>
        </Card>
    );
}

export default PostCardSkeleton;
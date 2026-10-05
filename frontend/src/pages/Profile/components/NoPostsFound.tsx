import image from '@/assets/NoPostsFound.png';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface NoPostsFoundProps {
    onReset?: () => void;
}

function NoPostsFound({ onReset }: NoPostsFoundProps) {
    return (
        <div className="flex flex-col items-center justify-center px-4">
            <img 
                src={image} 
                alt="No Posts Found" 
                className="w-64 h-auto mb-8 sm:w-80 md:w-96 opacity-90" 
            />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-center text-foreground">
                No Posts Found
            </h2>
            <p className="text-muted-foreground text-center max-w-md text-sm sm:text-base leading-relaxed mb-6">
                Your search didn't return any results. Try adjusting your search terms, or reset filters to get all posts.
            </p>
            {onReset && (
                <Button 
                    onClick={onReset}
                    variant="default"
                    effect={"ripple"}
                    className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset Filters
                </Button>
            )}
        </div>
    );
}

export default NoPostsFound;

import { useQuery } from "@apollo/client/react";
import { badges } from "@/lib/badges";
import { GetUserStatsDocument } from "@/graphql/generated";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function PintBadges({ userId }: { userId: string }) {
  const { data, loading, error } = useQuery(GetUserStatsDocument, {
    variables: { userId },
    skip: !userId,
  });

  const stats = data?.getUserStats;

  let content;

  if (loading) {
    content = (
      <p className="text-center text-gray-500">Loading badges...</p>
    );
  } else if (error) {
    content = (
      <p className="text-center text-red-500">Failed to load badges</p>
    );
  } else if (!stats) {
    content = (
      <p className="text-center text-gray-500">No badges available</p>
    );
  } else {
    const earnedBadges = badges
      .filter((badge) => badge.condition(stats))
      .sort((a, b) => a.priority - b.priority);

    if (earnedBadges.length === 0) {
      content = (
        <p className="text-center text-gray-500">No badges earned yet</p>
      );
    } else {
      content = (
        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-4 justify-left">
            {earnedBadges.map((badge) => (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <img
                    src={badge.icon}
                    alt={badge.title}
                    className="h-12 w-12 transition-transform hover:scale-110"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{badge.title}</p>
                  <p>{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      );
    }
  }

  return (
    <Card className="rounded-xl shadow-sm border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl font-semibold">
          Pint Badges
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

export { PintBadges };

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@apollo/client/react";
import { GetUserStatsDocument } from "@/graphql/generated";

import { Users, Heart, Images, Beer } from "lucide-react"; 

function PintStats({ userId }: { userId: string }) {
  const { data, loading, error } = useQuery(GetUserStatsDocument, {
    variables: { userId },
  });

  const stats = data?.getUserStats;

  return (
    <Card className="rounded-xl shadow-sm border bg-card hover:cursor-default">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl font-semibold">
          Pint Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="text-left leading-7">
        {loading && <p className="text-sm text-muted-foreground">Loading stats...</p>}
        {error && (
          <p className="text-sm text-red-500">Failed to load stats.</p>
        )}
        {!loading && !error && (
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <p className="">Total Followers: {stats?.follower_count ?? 0}</p>
            </li>
            <li className="flex items-center gap-2">
              <Images className="h-5 w-5 text-primary" />
              <p>Total Posts: {stats?.post_count ?? 0}</p>
            </li>
            <li className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <p>Posts Liked: {stats?.like_count ?? 0}</p>
            </li>
            <li className="flex items-center gap-2">
              <Beer className="h-5 w-5 text-primary" />
              <p>Total Pints Consumed: {stats?.pints_consumed_count ?? 0}</p>
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export { PintStats };

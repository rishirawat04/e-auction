import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from "lucide-react";
import { Auction } from "@/types/auction";

interface LeaderboardEntry {
  rank: number;
  bidderId: string;
  bidderName: string;
  amount: number;
  bidsCount: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  auction: Auction;
  leaderboard: LeaderboardEntry[];
  className?: string;
}

const Leaderboard = ({ auction, leaderboard, className }: LeaderboardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          {auction.bidType === "highest" ? (
            <TrendingUp className="h-5 w-5 text-success" />
          ) : (
            <TrendingDown className="h-5 w-5 text-primary" />
          )}
          Live Leaderboard
          <Badge variant="outline" className="ml-auto">
            {auction.totalBids} total bids
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {auction.bidType === "highest" ? "Highest bidders leading" : "Lowest bidders leading"}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {leaderboard.map((entry) => (
          <div
            key={entry.bidderId}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              entry.isCurrentUser
                ? "bg-primary/5 border-primary/20"
                : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(entry.rank)}
            </div>

            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {entry.bidderName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium truncate ${entry.isCurrentUser ? "text-primary" : ""}`}>
                  {entry.bidderName}
                  {entry.isCurrentUser && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      You
                    </Badge>
                  )}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {entry.bidsCount} bids placed
              </p>
            </div>

            <div className="text-right">
              <p className={`font-bold ${entry.rank === 1 ? "text-primary text-lg" : "text-sm"}`}>
                {formatPrice(entry.amount)}
              </p>
              {entry.rank === 1 && (
                <p className="text-xs text-success font-medium">
                  {auction.bidType === "highest" ? "Leading" : "Winning"}
                </p>
              )}
            </div>
          </div>
        ))}

        {auction.status === "live" && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg border-dashed border">
            <p className="text-center text-sm text-muted-foreground">
              Place a bid to join the leaderboard!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;

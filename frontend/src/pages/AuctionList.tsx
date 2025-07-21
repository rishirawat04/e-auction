import { useState, useEffect } from "react";
import { AuctionCard } from "@/components/AuctionCard";
// import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Auction } from "@/types/auction";
import { getAuctions, handleLogout } from "@/services/api";
import { Navigation } from "@/components/Navigation";

export const AuctionList = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bidTypeFilter, setBidTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("endTime");
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await getAuctions({ search: searchTerm, status: statusFilter, bidType: bidTypeFilter, sortBy });
        setAuctions(response);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, [searchTerm, statusFilter, bidTypeFilter, sortBy]);

  // Calculate Status Counts based on the fetched auctions
  const getStatusCounts = () => {
    return {
      all: auctions.length,
      live: auctions.filter(a => a.status === 'live').length,
      upcoming: auctions.filter(a => a.status === 'upcoming').length,
      ended: auctions.filter(a => a.status === 'ended').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
 <>
        <Navigation user={user} onLogout={handleLogout} />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6">Browse Auctions</h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="gap-2"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Bid Type Filter */}
            <div className="space-y-3">
              <h3 className="font-semibold">Bid Type</h3>
              <Select value={bidTypeFilter} onValueChange={setBidTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="highest">Highest Wins</SelectItem>
                  <SelectItem value="lowest">Lowest Wins</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-3">
              <h3 className="font-semibold">Sort By</h3>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endTime">End Time</SelectItem>
                  <SelectItem value="price">Current Price</SelectItem>
                  <SelectItem value="bids">Number of Bids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Live Auction Leaderboard */}
          {/* {auctions.filter(a => a.status === 'live').length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Live Auction Leaderboards</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {auctions
                  .filter(auction => auction.status === 'live')
                  .slice(0, 2)
                  .map((auction) => (
                    <div key={`leaderboard-${auction.id}`} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{auction.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {auction.bidType === 'highest' ? 'Highest Wins' : 'Lowest Wins'}
                        </Badge>
                      </div>
                      <Leaderboard auction={auction} />
                    </div>
                  ))}
              </div>
            </div>
          )} */}

          {/* Auctions Grid */}
          <div>
            <h3 className="text-xl font-semibold mb-4">All Auctions</h3>
            {auctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {auctions.map((auction) => (
                  <AuctionCard 
                    key={auction.id} 
                    auction={auction}
                    userRole={user?.role}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No auctions found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
 </>
  );
};

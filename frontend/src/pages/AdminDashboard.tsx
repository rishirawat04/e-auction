import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { deleteAuction, getAuctionsByAuctioneer, handleLogout } from "@/services/api";
import { Navigation } from "@/components/Navigation";

export const AdminDashboard = () => {
  const [auctions, setAuctions] = useState([]);
  const [loadingAuctionId, setLoadingAuctionId] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Fetch auctions created by the logged-in auctioneer
  const fetchAuctions = async () => {
    try {
      const data = await getAuctionsByAuctioneer();
      console.log(data, "data");
      
      setAuctions(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load auctions" });
    }
  };

  // Delete an auction
  const handleDelete = async (id: string) => {
    setLoadingAuctionId(id);
    try {
      await deleteAuction(id);
      toast({ title: "Auction deleted successfully" });
      fetchAuctions();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete auction" });
    } finally {
      setLoadingAuctionId(null);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []); 

  return (
    <>
      <Navigation user={user} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Upcoming Auctions</h2>
            <Link to="/admin/create-auction">
              <Button variant="outline">Create Auction</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => (
              <Card key={auction._id}>
                <CardHeader>
                  <CardTitle>{auction.title}</CardTitle>
                  <Badge className="w-fit">
                    {auction.status.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {auction.description}
                  </p>
                  {auction.status === "ended" && (
                    <div className="mt-4">
                      {auction.totalBids > 0 ? (
                        auction.winner ? (
                          <p className="text-sm font-medium text-muted-foreground">
                            Winner:{" "}
                            <span className="text-primary font-semibold">
                              {auction.winner.username}
                            </span>
                            , Bid: ${auction.winner.bidAmount}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-muted-foreground">
                            Winner details not available
                          </p>
                        )
                      ) : (
                        <p className="text-sm font-medium text-muted-foreground">
                          No bids placed
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex justify-between mt-4">
                    <Button
                      onClick={() => handleDelete(auction._id)}
                      disabled={loadingAuctionId === auction._id} 
                    >
                      {loadingAuctionId === auction._id
                        ? "Deleting..."
                        : "Delete"}
                    </Button>
                    <Link to={`/admin/auction/${auction._id}`}>
                      <Button variant="outline">View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

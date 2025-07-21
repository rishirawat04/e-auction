import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuctionById, handleLogout } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

export const AuctionResult = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Fetch auction result
  const fetchAuction = async () => {
    try {
      const data = await getAuctionById(id!);
      setAuction(data.auction);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load auction result" });
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [id]);



  if (!auction) return <div className="text-center mt-20">Loading auction...</div>;

  return (
    <>
      <Navigation user={user} onLogout={handleLogout} />
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {auction.title}
              <Badge>{auction.status.toUpperCase()}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-2">{auction.description}</p>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm">Base Price:</p>
                <p className="font-bold text-lg">${auction.basePrice}</p>
              </div>
              <div>
                <p className="text-sm">Final Price:</p>
                <p className="font-bold text-lg">${auction.currentPrice}</p>
              </div>
            </div>

            {auction.status === "ended" && auction.winner && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Winner: <span className="text-primary font-semibold">{auction.winner.username}</span>,
                  Bid: ${auction.winner.bidAmount}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

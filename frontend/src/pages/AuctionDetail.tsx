import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Auction } from "@/types/auction";
import { API_BASE_URL_SOCKET_IO, endAuction, getAuctionById, getBidsByAuction, handleLogout, placeBid } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import Leaderboard from "@/components/Leaderboard";
import { Navigation } from "@/components/Navigation";
import { io, Socket } from "socket.io-client";

export const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const socketRef = useRef<Socket | null>(null);

  // Fetch auction details
  const fetchAuction = async () => {
    try {
      const data = await getAuctionById(id!);
      setAuction(data.auction);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load auction" });
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await getBidsByAuction(id!);
      setLeaderboard(res.leaderboard);
    } catch (err) {
      console.error("Error fetching leaderboard");
    }
  };

  // Countdown timer logic
  useEffect(() => {
    if (!auction?.endTime) return;

    const updateTimer = () => {
      const endTime = new Date(auction.endTime).getTime();
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft("Auction ended");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction?.endTime]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(API_BASE_URL_SOCKET_IO, { withCredentials: true });
    }

    const socket = socketRef.current;

    fetchAuction();
    fetchLeaderboard();

    if (id) {
      socket.emit("joinAuctionRoom", id);
      socket.emit("getLeaderboard", id);
    }

    socket.on("bidUpdate", (newBid) => {
      if (auction && newBid.auctionId === auction._id) {
        setAuction((prev) => ({ ...prev!, currentPrice: newBid.amount, winner: newBid }));
      }
    });

    socket.on("leaderboardUpdate", (newLeaderboard) => {
      setLeaderboard(newLeaderboard);
    });

    socket.on("auctionEnded", ({ auctionId, winner }) => {
      if (auctionId === id) {
        setAuction((prev) => prev ? { ...prev, status: "ended", winner } : prev);
        toast({ title: "Auction Ended", description: `Winner: ${winner?.username}` });
      }
    });

    return () => {
      if (id) socket.emit("leaveAuctionRoom", id);
      socket.off("bidUpdate");
      socket.off("leaderboardUpdate");
      socket.off("auctionEnded");
    };
  }, [id]);

  const handleBid = async () => {
    try {
      setLoading(true);
      await placeBid(auction!._id, Number(amount));
      toast({ title: "Bid placed successfully" });
      setAmount("");
      fetchAuction();
      fetchLeaderboard();
    } catch (err) {
      toast({
        title: "Bid failed",
        description: err?.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

    const handleEndAuction = async () => {
    try {
      await endAuction(id!);
      toast({ title: "Auction Ended", description: "The auction has been successfully ended." });
      fetchAuction();
    } catch (err) {
      toast({ title: "Error", description: "Failed to end the auction" });
    }
  };




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
                <p className="text-sm">Current Price:</p>
                <p className="font-bold text-lg">${auction.currentPrice}</p>
              </div>
              <div>
                <p className="text-sm">Bid Type:</p>
                <p className="font-bold text-lg">{auction.bidType.toUpperCase()}</p>
              </div>
            </div>

            {auction.status === "live" && (
              <p className="text-sm font-medium text-muted-foreground mb-4">
                Time Left: <span className="text-primary font-semibold">{timeLeft}</span>
              </p>
            )}

            {auction.status === "live" && user?.role === "bidder" && (
              <div className="flex gap-2 items-end">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter your bid"
                />
                <Button onClick={handleBid} disabled={loading || !amount}>
                  {loading ? "Placing..." : "Place Bid"}
                </Button>
              </div>
            )}

            {auction.status === "ended" && auction.winner && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Winner: <span className="text-primary font-semibold">{auction.winner.username}</span>,
                  Bid: ${auction.winner.bidAmount}
                </p>
              </div>
            )}

                     {/* End Auction Button (Only for Auctioneers) */}
            {auction.status === "live" && user?.role === "auctioneer" && (
              <div className="mt-4">
                <Button onClick={handleEndAuction}>End Auction</Button>
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Leaderboard</h4>
              <Leaderboard auction={auction} leaderboard={leaderboard} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
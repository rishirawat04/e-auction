import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Auction } from "@/types/auction";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface AuctionCardProps {
  auction: Auction;
  userRole?: 'auctioneer' | 'bidder';
}

export const AuctionCard = ({ auction, userRole }: AuctionCardProps) => {

  
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.endTime).getTime();
      const startTime = new Date(auction.startTime).getTime();
      
      if (auction.status === 'upcoming') {
        const difference = startTime - now;
        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`Starts in ${hours}h ${minutes}m`);
        }
      } else if (auction.status === 'live') {
        const difference = endTime - now;
        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else {
          setTimeLeft("Ended");
        }
      } else {
        setTimeLeft("Ended");
      }
    };

    console.log(auction, "auc");
    

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); 

    return () => clearInterval(timer);
  }, [auction.endTime, auction.startTime, auction.status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-success text-success-foreground';
      case 'upcoming': return 'bg-warning text-warning-foreground';
      case 'ended': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge className={getStatusColor(auction.status)} variant="secondary">
            {auction.status.toUpperCase()}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {timeLeft}
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg line-clamp-1">{auction.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {auction.description}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="py-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">
                {auction.bidType === 'highest' ? 'Current Highest' : 'Current Lowest'}
              </p>
              <p className="text-xl font-bold text-primary">
                {formatPrice(auction.currentPrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Base Price</p>
              <p className="text-sm font-medium">
                {formatPrice(auction.basePrice)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {auction.totalBids} bids
            </div>
            <div className="flex items-center">
              {auction.bidType === 'highest' ? (
                <TrendingUp className="h-4 w-4 mr-1 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1 text-primary" />
              )}
              {auction.bidType} wins
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            by {auction.auctioneerName}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Link to={`/auction/detail/${auction._id}`} className="w-full">
          <Button 
            className="w-full" 
            variant={auction.status === 'live' && userRole === 'bidder' ? 'default' : 'outline'}
            disabled={auction.status === 'ended'}
          >
            {auction.status === 'ended' 
              ? 'View Results' 
              : auction.status === 'live' && userRole === 'bidder'
              ? 'Place Bid'
              : 'View Details'
            }
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
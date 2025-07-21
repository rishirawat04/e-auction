export interface User {
  id: string;
  username: string;
  email: string;
  role: 'auctioneer' | 'bidder';
  createdAt: Date;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  bidType: 'highest' | 'lowest';
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'live' | 'ended';
  auctioneerId: string;
  auctioneerName: string;
  imageUrl?: string;
  totalBids: number;
  winner?: {
    id: string;
    username: string;
    bidAmount: number;
  };
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
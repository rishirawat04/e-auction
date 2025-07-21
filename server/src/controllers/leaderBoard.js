import auctionModel from "../models/auctionModel.js";
import bidModel from "../models/bidModel.js";


export const getLeaderboard = async (auctionId) => {
  const auction = await auctionModel.findById(auctionId);
  if (!auction) throw new Error('Auction not found');

  const sort = auction.bidType === 'highest' ? -1 : 1;

  const bids = await bidModel.find({ auctionId: auction._id }).sort({ amount: sort });

  const seen = new Set();
  const leaderboard = bids.filter(bid => {
    if (seen.has(bid.bidderId.toString())) return false;
    seen.add(bid.bidderId.toString());
    return true;
  });

  return leaderboard;
};

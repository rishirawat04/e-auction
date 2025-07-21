import auctionModel from "../models/auctionModel.js";
import bidModel from "../models/bidModel.js";
import { getLeaderboard } from "./leaderBoard.js";

export const placeBid = async (req, res) => {
  try {
    const { auctionId, amount } = req.body;
    const userId = req.user._id;

    const now = new Date();

    const auction = await auctionModel.findById(auctionId);
    if (!auction)
      return res.status(400).json({ message: "Invalid auction" });

    if (auction.status !== "live")
      return res.status(400).json({ message: "Auction is not live currently" });

    if (auction.startTime && now < new Date(auction.startTime)) {
      return res.status(400).json({ message: "Auction has not started yet" });
    }

    if (auction.endTime && now > new Date(auction.endTime)) {
      auction.status = "ended";
      await auction.save();
      req.io
        .to(auctionId)
        .emit("auctionEnded", { auctionId, winner: auction.winner });
      return res.status(400).json({ message: "Auction already ended" });
    }

    const isBetterBid =
      (auction.bidType === "highest" && amount > auction.currentPrice) ||
      (auction.bidType === "lowest" && amount < auction.currentPrice);

    if (!isBetterBid)
      return res
        .status(400)
        .json({ message: "Bid is not better than current bid" });

    const bid = await bidModel.create({
      auctionId,
      bidderId: userId,
      bidderName: req.user.fullName,
      amount,
    });

    auction.currentPrice = amount;
    auction.totalBids += 1;
    auction.winner = {
      id: userId,
      username: req.user.fullName,
      bidAmount: amount,
    };

    await auction.save();

    // Emit live bid to auction room
    req.io.to(auctionId).emit("bidUpdate", {
      auctionId,
      bidderId: userId,
      bidderName: req.user.fullName,
      amount,
    });

    const leaderBoard = await getLeaderboard(auctionId);
    req.io.to(auctionId).emit('leaderboardUpdate', leaderBoard);

    res.status(200).json({ success: true, bid });
  } catch (error) {
    console.error("Bid error:", err);
    res.status(500).json({ message: "Bid failed" });
  }
};

export const getBidsByAuction = async (req, res) => {
  try {
    const auction = await auctionModel.findById(req.params.auctionId);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    const sort = auction.bidType === "highest" ? -1 : 1;

    const bids = await bidModel
      .find({ auctionId: auction._id })
      .sort({ amount: sort });

    const seen = new Set();
    const leaderboard = bids.filter((bid) => {
      if (seen.has(bid.bidderId.toString())) return false;
      seen.add(bid.bidderId.toString());
      return true;
    });

    res.status(200).json({ success: true, leaderboard });
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

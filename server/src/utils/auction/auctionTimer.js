import auctionModel from "../../models/auctionModel.js";

export const checkAuctionEndings = async (io) => {
  const now = new Date();

  const endingAuctions = await auctionModel.find({
    status: 'live',
    endTime: { $lte: now }
  });

  for (let auction of endingAuctions) {
    auction.status = 'ended';
    await auction.save();

    io.to(auction._id.toString()).emit('auctionEnded', {
      auctionId: auction._id,
      winner: auction.winner,
    });

    console.log(`Auto-ended auction: ${auction._id}`);
  }
};

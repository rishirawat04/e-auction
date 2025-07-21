import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  bidderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidderName: String,
  amount: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Bid', bidSchema);

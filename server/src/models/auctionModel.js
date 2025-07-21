import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  basePrice: Number,
  currentPrice: Number,
  bidType: { type: String, enum: ['highest', 'lowest'], required: true },
  startTime: Date,
  endTime: Date,
  status: { type: String, enum: ['upcoming', 'live', 'ended'], default: 'upcoming' },
  auctioneerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalBids: { type: Number, default: 0 },
  winner: {
    id: String,
    username: String,
    bidAmount: Number
  }
}, { timestamps: true });

export default mongoose.model('Auction', auctionSchema);

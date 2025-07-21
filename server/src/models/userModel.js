import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  fullName: {type: String, trim:true},
  email: { type: String, unique: true, sparse: true, trim:true },
  password: String,
  role: { type: String, enum: ['bidder', 'auctioneer'], default: 'bidder' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);

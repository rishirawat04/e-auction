import Auction from '../models/auctionModel.js';

export const createAuction = async (req, res) => {
  try {
    const { title, description, imageUrl, basePrice, bidType, startTime, endTime } = req.body;

    const newAuction = await Auction.create({
      title,
      description,
      imageUrl,
      basePrice,
      currentPrice: basePrice,
      bidType,
      startTime,
      endTime,
      status: 'upcoming',
      auctioneerId: req.user._id,
    });

    res.status(201).json({ success: true, auction: newAuction });
  } catch (err) {
    console.error("Create Auction Error:", err);
    res.status(500).json({ message: 'Failed to create auction' });
  }
};

export const getAllAuctions = async (req, res) => {
  try {
    const { status, bidType, sortBy, search } = req.query;

    let filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (bidType && bidType !== 'all') {
      filter.bidType = bidType;
    }


    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const auctions = await Auction.find(filter);

    if (sortBy === 'endTime') {
      auctions.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    } else if (sortBy === 'price') {
      auctions.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === 'bids') {
      auctions.sort((a, b) => b.totalBids - a.totalBids);
    }

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    res.status(200).json({ success: true, auction });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get auction' });
  }
};

export const updateAuction = async (req, res) => {
  const updateData = req.body
  try {
    const updatedAuction = await Auction.findByIdAndUpdate(req.params.id,{ $set:updateData, currentPrice: updateData.basePrice  }, {
      new: true,
    });

   

    if (!updatedAuction)
      return res.status(404).json({ message: 'Auction not found' });

    res.status(200).json({ success: true, auction: updatedAuction });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update auction' });
  }
};

export const deleteAuction = async (req, res) => {
  try {
    const deleted = await Auction.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: 'Auction not found' });

    res.status(200).json({ message: 'Auction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete auction' });
  }
};

export const endAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    if (auction.status === 'ended') {
      return res.status(400).json({ message: 'Auction is already ended' });
    }

    auction.status = 'ended';
    await auction.save();

    req.io.to(id).emit('auctionEnded', {
      auctionId: id,
      winner: auction.winner,
    });

    res.status(200).json({
      success: true,
      message: 'Auction ended successfully',
      winner: auction.winner,
    });
  } catch (err) {
    console.error('End Auction Error:', err);
    res.status(500).json({ message: 'Failed to end auction' });
  }
};

export const getAuctionsByAuctioneer = async (req, res) => {
  try {
    const { status, bidType, sortBy, search } = req.query;

    let filter = {
      auctioneerId: req.user._id,
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (bidType && bidType !== 'all') {
      filter.bidType = bidType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let auctions = await Auction.find(filter);

    if (sortBy === 'endTime') {
      auctions.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    } else if (sortBy === 'price') {
      auctions.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === 'bids') {
      auctions.sort((a, b) => b.totalBids - a.totalBids);
    }

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


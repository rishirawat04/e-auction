import cron from 'node-cron';
import auctionModel from '../models/auctionModel.js';
export const udpateAuctionStatusCron = async() => {
    cron.schedule('*/1 * * * *', async() => {
        const now = new Date();

        const upcomingAuctions = await auctionModel.find({
            status: 'upcoming',
            startTime: {$lte: now},
        });

        for(let auction of upcomingAuctions){
            auction.status = 'live';
            await auction.save();
            console.log(`Auction ${auction.title} moved to live status`);
        }
    })
}
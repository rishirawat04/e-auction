import { getLeaderboard } from "../controllers/leaderBoard.js";

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New socket connected:', socket.id);

    socket.on('joinAuctionRoom', (auctionId) => {
      socket.join(auctionId);
      console.log(`Joined room: ${auctionId}`);
    });

    socket.on('leaveAuctionRoom', (auctionId) => {
      socket.leave(auctionId);
      console.log(`Left room: ${auctionId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });

    socket.on('getLeaderboard', async (auctionId) => {
      try {
        const leaderboard = await getLeaderboard(auctionId);
        socket.emit('leaderboardUpdate', leaderboard);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    });
  });
};

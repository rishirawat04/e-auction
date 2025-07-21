import express from 'express'
import  authRoutes  from "./authRoutes.js"
import  auctionRoute  from "./auctionRoutes.js"
import  bidRoute  from "./bidRoutes.js"
const router = express.Router()

router.use('/auth', authRoutes);
router.use('/auction', auctionRoute);
router.use('/bid', bidRoute);

export default router;
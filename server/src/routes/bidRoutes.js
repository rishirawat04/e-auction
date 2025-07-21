import express from 'express';
import { authenticate } from "../middlewares/authmiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { placeBid, getBidsByAuction } from '../controllers/bidController.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('bidder'), placeBid);
router.get('/:auctionId', authenticate, getBidsByAuction);

export default router;

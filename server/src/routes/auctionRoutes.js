import express from 'express';
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
  endAuction,
  getAuctionsByAuctioneer
} from '../controllers/auctionController.js';
import { authenticate } from "../middlewares/authmiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post('/', authenticate, authorizeRoles('auctioneer'), createAuction);
router.get('/my-auctions', authenticate, authorizeRoles('auctioneer'), getAuctionsByAuctioneer);
router.get('/', getAllAuctions);
router.get('/:id', getAuctionById);
router.put('/:id', authenticate, authorizeRoles('auctioneer'), updateAuction);
router.delete('/:id', authenticate, authorizeRoles('auctioneer'), deleteAuction);
router.post('/:id/end', authenticate, authorizeRoles('auctioneer'), endAuction);
export default router;

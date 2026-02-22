import express from 'express';
import {
    getRewards,
    redeemReward,
    createReward,
    getPendingRedemptions,
    fulfillRedemption
} from '../controllers/storeController.js';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/User routes
router.get('/rewards', isAuthenticated, getRewards);
router.post('/redeem', isAuthenticated, redeemReward);

// Admin routes
router.post('/admin/rewards', isAuthenticated, isAdmin, createReward);
router.get('/admin/redemptions/pending', isAuthenticated, isAdmin, getPendingRedemptions);
router.put('/admin/redemptions/:redemptionId', isAuthenticated, isAdmin, fulfillRedemption);

export default router;

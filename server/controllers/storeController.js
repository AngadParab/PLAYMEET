import Reward from '../models/Reward.js';
import Redemption from '../models/Redemption.js';
import PointTransaction from '../models/PointTransaction.js';
import User from '../models/userModel.js';
import PointService from '../services/PointService.js';

export const getRewards = async (req, res) => {
    try {
        const rewards = await Reward.find({ isActive: true }).sort({ cost: 1 });
        res.json({ success: true, data: rewards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const redeemReward = async (req, res) => {
    try {
        const { rewardId } = req.body;
        const userId = req.user._id;

        const reward = await Reward.findById(rewardId);
        if (!reward || !reward.isActive) {
            return res.status(404).json({ success: false, message: "Reward not found or inactive" });
        }

        if (reward.stock <= 0) {
            return res.status(400).json({ success: false, message: "Reward out of stock" });
        }

        const user = await User.findById(userId);
        if (user.pointsWallet < reward.cost) {
            return res.status(400).json({ success: false, message: "Insufficient points" });
        }

        // Deduct points using PointService
        await PointService.awardPoints(
            userId,
            -reward.cost, // Negative amount for deduction
            'redeemed',
            `Redeemed: ${reward.name}`
        );

        // Create redemption record
        const redemption = await Redemption.create({
            user: userId,
            reward: rewardId,
            status: 'pending'
        });

        // Decrease stock
        reward.stock -= 1;
        await reward.save();

        res.json({ success: true, data: redemption, message: "Redemption successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin endpoints
export const createReward = async (req, res) => {
    try {
        const reward = await Reward.create(req.body);
        res.status(201).json({ success: true, data: reward });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPendingRedemptions = async (req, res) => {
    try {
        const redemptions = await Redemption.find({ status: 'pending' })
            .populate('user', 'name email username')
            .populate('reward');
        res.json({ success: true, data: redemptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const fulfillRedemption = async (req, res) => {
    try {
        const { redemptionId } = req.params;
        const { status, fulfillmentDetails } = req.body;

        const redemption = await Redemption.findByIdAndUpdate(
            redemptionId,
            { status, fulfillmentDetails },
            { new: true }
        );

        if (!redemption) {
            return res.status(404).json({ success: false, message: "Redemption not found" });
        }

        // If rejected, refund points? (Optional: The PRD said manual fulfillment MVP, we can keep it simple)
        if (status === 'rejected') {
            const reward = await Reward.findById(redemption.reward);
            if (reward) {
                await PointService.awardPoints(
                    redemption.user,
                    reward.cost,
                    'earned',
                    `Refund for rejected redemption: ${reward.name}`
                );
                reward.stock += 1;
                await reward.save();
            }
        }

        res.json({ success: true, data: redemption });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

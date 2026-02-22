import User from "../models/userModel.js";
import PointTransaction from "../models/PointTransaction.js";

class PointService {
    /**
     * Award points to a user and log the transaction.
     * @param {String} userId - The user's ID
     * @param {Number} amount - Amount of points to award (can be negative for deductions)
     * @param {String} type - 'earned' or 'redeemed'
     * @param {String} reason - E.g. 'Hosted Match', 'Gift Card Redemption'
     * @param {String} mode - 'athletes' or 'esports'
     */
    static async awardPoints(userId, amount, type, reason, mode = null) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            // Update wallets
            user.pointsWallet += amount;
            if (amount > 0) {
                user.lifetimePoints += amount;
            }

            // Ensure points don't go negative
            if (user.pointsWallet < 0) {
                user.pointsWallet = 0;
            }

            // Log activity
            user.activityLog.push({
                action: type === 'earned' ? 'point_earned' : 'point_redeemed',
                points: amount,
                category: 'economy',
                description: reason,
                timestamp: new Date()
            });

            await user.save();

            // Create ledger entry
            await PointTransaction.create({
                user: userId,
                amount,
                type,
                reason,
                mode
            });

            return user;
        } catch (error) {
            console.error("Error awarding points:", error);
            throw error; // Let caller handle it
        }
    }

    /**
     * Award points specifically for an event's completion
     */
    static async processEventCompletion(event) {
        try {
            // Host reward (+50 points)
            if (event.createdBy) {
                await this.awardPoints(
                    event.createdBy,
                    50,
                    'earned',
                    `Hosted ${event.gameType || event.sport || 'an'} Event`,
                    event.mode || 'athletes'
                );
            }

            // Participants reward (+10 points)
            if (event.participants && event.participants.length > 0) {
                for (const participant of event.participants) {
                    // Skip creator to avoid double dipping
                    if (participant.user.toString() !== event.createdBy.toString()) {
                        // Optionally check if participant attended
                        // if (participant.status === 'joined' || participant.rsvpStatus === 'yes') {
                        await this.awardPoints(
                            participant.user,
                            10,
                            'earned',
                            `Participated in an Event`,
                            event.mode || 'athletes'
                        );
                        // }
                    }
                }
            }
        } catch (error) {
            console.error("Error processing event completion points:", error);
        }
    }

    /**
     * Process tournament victory
     */
    static async processTournamentVictory(userId, tournamentName, mode = 'esports') {
        return this.awardPoints(userId, 200, 'earned', `Won Tournament: ${tournamentName}`, mode);
    }
}

export default PointService;

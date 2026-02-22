import mongoose from "mongoose";

const redemptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reward: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reward",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "fulfilled", "rejected"],
            default: "pending",
        },
        fulfillmentDetails: {
            type: String, // e.g., the code itself
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Redemption", redemptionSchema);

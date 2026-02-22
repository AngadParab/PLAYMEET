import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // e.g., "$10 Amazon Gift Card"
        },
        cost: {
            type: Number,
            required: true, // e.g., 1000 points
        },
        image: {
            type: String, // Store image URL
        },
        stock: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Reward", rewardSchema);

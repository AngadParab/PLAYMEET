import mongoose from "mongoose";

const pointTransactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ["earned", "redeemed"],
            required: true,
        },
        reason: {
            type: String,
            required: true, // e.g., "Hosted Match", "Gift Card Redemption"
        },
        mode: {
            type: String,
            enum: ["athletes", "esports"],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("PointTransaction", pointTransactionSchema);

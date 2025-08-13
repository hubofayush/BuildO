import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
    {
        creation_id: {
            type: mongoose.Types.ObjectId,
            ref: "creation",
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

LikeSchema.index({ creation_id: 1, user_id: 1 }, { unique: true });

export const Like = mongoose.model("like", LikeSchema);

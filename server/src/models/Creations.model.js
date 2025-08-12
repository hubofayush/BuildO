import mongoose, { Schema } from "mongoose";

const creationsShema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        publish: {
            type: Boolean,
            default: false,
        },
        likes: [{ type: String, default: {} }],
    },
    { timestamps: true }
);

export const Creations = mongoose.model("creation", creationsShema);

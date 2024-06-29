import mongoose from "mongoose";

const advertSchema = new mongoose.Schema(
    {
        endTimeA: {
            type: Date,
            required: true,
        },
        startTimeA: {
            type: Date,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        imgURL: {
            type: String,
            require: true,
        },
        url: {
            type: String,
        }
    },
    { timestamps: true }
);

export const AdvertModel = mongoose.model("Advertisement", advertSchema);

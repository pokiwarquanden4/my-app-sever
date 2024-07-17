import mongoose, { Schema } from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reportAccount: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        postOwner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        reason: {
            type: String,
            default: ''
        },
        status: {
            type: Number,
            default: 0
        },
        reportedPost: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            require: true
        },
    },
    { timestamps: true }
);

export const ReportModel = mongoose.model("Report", reportSchema);

import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            require: true
        },
    },
    { timestamps: true }
)

export const responseSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            require: true
        },
        vertified: {
            type: Boolean,
            default: false
        },
        rate: {
            type: Number,
            default: 0
        },
        comment: [
            {
                type: commentSchema
            }
        ]
    },
    { timestamps: true }
)

export const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            require: true
        },
        content: {
            type: String,
            require: true
        },
        close: {
            type: Boolean,
            default: false,
        },
        tags: {
            type: Array,
            default: [],
        },
        rate: {
            type: Number,
            default: 0,
        },
        slove: {
            type: Boolean,
            default: false,
        },
        reportNum: {
            type: Array,
            default: [],
        },
        enable: {
            type: Boolean,
            default: true,
        },
        view: {
            type: Array,
            default: [],
        },
        responses: [
            {
                type: responseSchema
            }
        ]
    },
    { timestamps: true }
);



export const PostModel = mongoose.model("Post", postSchema);

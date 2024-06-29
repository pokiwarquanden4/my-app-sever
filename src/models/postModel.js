import mongoose, { Schema } from "mongoose";

export const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
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
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
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
        comment: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    },
    { timestamps: true }
)

export const postSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        title: {
            type: String,
            require: true
        },
        subTitle: {
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
        responses: [{
            type: Schema.Types.ObjectId,
            ref: 'Response'
        }],
    },
    { timestamps: true }
);



export const PostModel = mongoose.model("Post", postSchema);
export const ResponseModel = mongoose.model('Response', responseSchema);
export const CommentModel = mongoose.model('Comment', commentSchema);

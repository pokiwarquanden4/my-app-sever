import { PostModel, commentSchema, postSchema, responseSchema } from "../../models/postModel.js";
import mongoose from 'mongoose';
import { tagsList } from '../../utils/tags.js'

const Response = mongoose.model('Response', responseSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

export const getTags = async (req, res, next) => {
    try {
        res.locals.status = 200
        res.locals.data = {
            tags: tagsList
        }
        next()
    } catch (err) {
        res.locals.status = 500
        res.locals.data = {
            message: "Sever Error"
        }
        next()
    }
};

export const createPost = async (req, res, next) => {
    try {
        const { title, content, tags, jwtAccount } = req.body;

        // Check if required fields are missing
        if (!title || !content || !tags) {
            res.locals.status = 422
            res.locals.data = {
                message: "Missing required fields"
            }
            next()
        }

        // Create the post
        PostModel.create({
            userId: jwtAccount.account,
            title,
            content,
            tags,
        }).then(() => {
            res.locals.status = 200
            res.locals.data = {
                message: "Create Success"
            }
            next()
        }).catch((error) => {
            switch (error.code) {
                default:
                    res.locals.status = 500
                    res.locals.data = {
                        message: "Sever Error"
                    }
                    next()
            }
        });
    } catch (err) {
        res.locals.status = 500
        res.locals.data = {
            message: "Sever Error"
        }
        next()
    }
};

export const responsePost = async (req, res, next) => {
    try {
        const { postId, content, jwtAccount } = req.body;

        // Check if required fields are missing
        if (!postId || !content) {
            res.locals.status = 422
            res.locals.data = {
                message: "Missing required fields"
            }
            next()
        }

        // Create a new response using the responseSchema
        const newResponse = new Response({
            userId: jwtAccount.account,
            content: content,
        });

        // Find the post with the given postId
        const post = await Post.findById(postId);

        // Check if the post exists
        if (!post) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Post not found"
            };
            next();
        }

        // Add the new response to the post's responses array
        post.responses.push(newResponse);

        // Save the updated post
        await post.save();
        res.locals.status = 200;
        res.locals.data = {
            message: "Response added successfully"
        };
        next();
    } catch (err) {
        res.locals.status = 500
        res.locals.data = {
            message: "Sever Error"
        }
        next()
    }
};

export const commentResponse = async (req, res, next) => {
    try {
        const { responseId, content, jwtAccount } = req.body;

        // Check if required fields are missing
        if (!responseId || !content) {
            res.locals.status = 422;
            res.locals.data = {
                message: "Missing required fields"
            };
            return next();
        }

        // Create a new comment using the commentSchema
        const newComment = new Comment({
            userId: jwtAccount.account,
            content: content,
        });

        // Find the response with the given responseId
        const response = await Response.findById(responseId);

        // Check if the response exists
        if (!response) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Response not found"
            };
            next();
        }

        // Add the new comment to the response's comments array
        response.comment.push(newComment);

        // Save the updated response
        await response.save();

        res.locals.status = 200;
        res.locals.data = {
            message: "Comment added successfully"
        };
        next();

    } catch (err) {
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        next();
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const { number, type } = req.query;

        let query = {};

        // Handle pagination based on the 'number' parameter
        const skip = (parseInt(number) - 1) * 10;

        // Determine the query based on the 'type' parameter
        switch (type) {
            case 'Newest':
                query = {}; // No specific conditions for newest posts
                break;
            case 'Active':
                query = { enable: true };
                break;
            case 'Unanswered':
                query = { 'response': { $exists: false } };
                break;
            case 'Star':
                query = {}; // Default query, will sort by rate later
                break;
            case 'Answered':
                query = { 'response.vertified': true };
                break;
            default:
                res.locals.status = 400;
                res.locals.data = {
                    message: "Invalid type parameter"
                };
                return next();
        }

        // Execute the query to get the paginated posts
        let posts = [];
        let totalCount = 0;

        if (type === 'Star') {
            // For 'Star' type, sort by rate in descending order
            posts = await Post.find(query)
                .sort({ rate: -1 })
                .skip(skip)
                .limit(10)
                .select({
                    rate: 1,
                    answer: { $size: '$responses' }, // Assuming 'responses' is the array field in postSchema
                    title: 1,
                    content: 1,
                    tags: 1,
                    userId: 1,
                    updatedAt: 1,
                    verified: { $sum: '$responses.verified' },
                });

            // Execute a separate query to get the total count
            totalCount = await Post.countDocuments(query);
        } else {
            posts = await Post.find(query)
                .skip(skip)
                .limit(10)
                .select({
                    rate: 1,
                    answer: { $size: '$responses' }, // Assuming 'responses' is the array field in postSchema
                    title: 1,
                    content: 1,
                    tags: 1,
                    userId: 1,
                    updatedAt: 1,
                    verified: { $sum: '$responses.verified' },
                });

            // Execute a separate query to get the total count
            totalCount = await Post.countDocuments(query);
        }

        res.locals.status = 200;
        res.locals.data = {
            posts: posts,
            totalCount: totalCount
        };
        next();

    } catch (err) {
        console.error(err);
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        next();
    }
};

export const getAllResponses = async (req, res, next) => {
    try {
        const { postId } = req.params;

        // Find the post with the given postId
        const post = await Post.findById(postId);

        // Check if the post exists
        if (!post) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Post not found"
            };
            next();
        }

        // Retrieve all responses for the post
        const responses = await Response.find({ _id: { $in: post.responses } });

        res.locals.status = 200;
        res.locals.data = {
            id: responses._id,
            responses: responses
        };
        next();

    } catch (err) {
        console.error(err);
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        next();
    }
};

export const getAllComments = async (req, res, next) => {
    try {
        const { responseId } = req.params;

        // Find the response with the given responseId
        const response = await Response.findById(responseId);

        // Check if the response exists
        if (!response) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Response not found"
            };
            next();
        }

        // Retrieve all comments for the response
        const comments = await Comment.find({ _id: { $in: response.comment } });

        res.locals.status = 200;
        res.locals.data = {
            comments: comments
        };
        next();

    } catch (err) {
        console.error(err);
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        next();
    }
};
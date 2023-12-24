import { CommentModel, PostModel, ResponseModel } from "../../models/postModel.js";
import { NotifyModel, UserModel } from "../../models/userModel.js";
import { tagsList } from '../../utils/tags.js'

export const getTags = async (req, res, next) => {
    try {
        res.locals.status = 200
        res.locals.data = {
            tags: tagsList
        }
        return next()
    } catch (err) {
        res.locals.status = 500
        res.locals.data = {
            message: "Sever Error"
        }
        return next()
    }
};

export const createPost = async (req, res, next) => {
    try {
        const { title, subTitle, content, tags, jwtAccount } = req.body;

        // Check if required fields are missing
        if (!title || !content || !tags) {
            res.locals.status = 422;
            res.locals.data = {
                message: "Missing required fields",
            };
            return next();
            return;
        }

        // Create the post
        const createdPost = await PostModel.create({
            userId: jwtAccount.account,
            title,
            subTitle,
            content,
            tags,
        });

        // Add the post's _id to the user's userPost field
        await UserModel.updateOne(
            { account: jwtAccount.account },
            { $push: { userPost: createdPost._id } }
        );

        res.locals.status = 200;
        res.locals.data = {
            message: "Create Success",
        };
        return next();
    } catch (error) {
        console.error(error);
        switch (error.code) {
            default:
                res.locals.status = 500;
                res.locals.data = {
                    message: "Server Error",
                };
                return next();
        }
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
            return next()
        }

        // Create a new response using the responseSchema
        const newResponse = await ResponseModel.create({
            userId: jwtAccount.account,
            content: content,
        });
        const post = await PostModel.findById(postId);
        if (!post) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Post not found"
            };
            return next();
        }
        post.responses.push(newResponse.id);
        await post.save();

        // Create a new notify
        if (jwtAccount.account !== post.userId) {
            const newNotify = await NotifyModel.create({
                postId: post.id,
                responseId: newResponse.id,
                details: {
                    sender: jwtAccount.account,
                    postName: post.title
                }
            })
            await UserModel.updateOne(
                { account: post.userId },
                { $push: { notification: newNotify.id } }
            );
        }

        res.locals.status = 200;
        res.locals.data = {
            message: "Response added successfully",
            response: newResponse
        };
        return next();
    } catch (err) {
        res.locals.status = 500
        res.locals.data = {
            message: "Sever Error"
        }
        return next()
    }
};

export const commentResponse = async (req, res, next) => {
    try {
        const { postId, responseId, content, jwtAccount } = req.body;

        // Check if required fields are missing
        if (!responseId || !content) {
            res.locals.status = 422;
            res.locals.data = {
                message: "Missing required fields"
            };
            return next();
        }

        //Create Comment
        const newComment = await CommentModel.create({
            userId: jwtAccount.account,
            content: content,
        });
        const response = await ResponseModel.findById(responseId);
        if (!response) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Response not found"
            };
            return next();
        }
        response.comment.push(newComment.id);
        await response.save();

        // Create a new notify
        if (jwtAccount.account !== response.userId) {
            const newNotify = await NotifyModel.create({
                postId: postId,
                commentId: newComment.id,
                details: {
                    sender: jwtAccount.account,
                    content: content
                }
            })
            await UserModel.updateOne(
                { account: post.userId },
                { $push: { notification: newNotify.id } }
            );
        }

        res.locals.status = 200;
        res.locals.data = {
            message: "Comment added successfully",
            comment: newComment
        };
        return next();

    } catch (err) {
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        return next();
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
            posts = await PostModel.find(query)
                .sort({ rate: -1 })
                .skip(skip)
                .limit(10)
                .select({
                    _id: 1,
                    rate: 1,
                    answer: { $size: '$responses' }, // Assuming 'responses' is the array field in postSchema
                    title: 1,
                    subTitle: 1,
                    tags: 1,
                    userId: 1,
                    updatedAt: 1,
                    verified: { $sum: '$responses.verified' },
                });

            // Execute a separate query to get the total count
            totalCount = await PostModel.countDocuments(query);
        } else {
            posts = await PostModel.find(query)
                .skip(skip)
                .limit(10)
                .select({
                    _id: 1,
                    rate: 1,
                    answer: { $size: '$responses' }, // Assuming 'responses' is the array field in postSchema
                    title: 1,
                    subTitle: 1,
                    tags: 1,
                    userId: 1,
                    updatedAt: 1,
                    verified: { $sum: '$responses.verified' },
                });

            // Execute a separate query to get the total count
            totalCount = await PostModel.countDocuments(query);
        }

        res.locals.status = 200;
        res.locals.data = {
            posts: posts,
            totalCount: totalCount
        };
        return next();

    } catch (err) {
        console.error(err);
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        return next();
    }
};

export const getResponses = async (req, res, next) => {
    try {
        const postId = req.query.id;

        // Find the post with the given postId
        const post = await PostModel.findById(postId);

        // Check if the post exists
        if (!post) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Post not found"
            };
            return next();
        }

        // Retrieve all responses for the post
        const responses = await ResponseModel.find({ _id: { $in: post.responses } });

        res.locals.status = 200;
        res.locals.data = {
            id: responses._id,
            responses: responses
        };
        return next();

    } catch (err) {
        console.error(err);
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        return next();
    }
};

export const getComments = async (req, res, next) => {
    try {
        const responseId = req.query.id;

        // Find the response with the given responseId
        const response = await ResponseModel.findById(responseId);

        // Check if the response exists
        if (!response) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Response not found"
            };
            return next();
        }

        // Retrieve all comments for the response
        const comments = await CommentModel.find({ _id: { $in: response.comment } });

        res.locals.status = 200;
        res.locals.data = {
            comments: comments
        };
        return next();

    } catch (err) {
        console.error(err);
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        return next();
    }
};

export const getPostsBySearch = async (req, res, next) => {
    try {
        const { searchVal } = req.query;

        // Split the searchVal into an array of words
        const searchWords = searchVal.split(' ');

        // Create a regular expression to match any of the search words in title, subTitle, or content
        const regex = new RegExp(searchWords.join('|'), 'i');

        // Find posts that match the search criteria
        const posts = await PostModel.find({
            $or: [
                { title: { $regex: regex } },
                { subTitle: { $regex: regex } },
                { content: { $regex: regex } }
            ]
        }).limit(10).select({
            _id: 1,
            title: 1,
            content: 1,
            subTitle: 1,
        });

        // Filter posts based on the percentage of matching letters
        const filteredPosts = posts.filter(post => {
            const titleMatchPercentage = calculateMatchPercentage(post.title, searchVal);
            const subTitleMatchPercentage = calculateMatchPercentage(post.subTitle, searchVal);
            const contentMatchPercentage = calculateMatchPercentage(post.content, searchVal);

            return (
                titleMatchPercentage > 50 ||
                subTitleMatchPercentage > 50 ||
                contentMatchPercentage > 50
            );
        });

        res.locals.status = 200;
        res.locals.data = {
            message: "Posts found successfully",
            posts: filteredPosts
        };
        return next();
    } catch (err) {
        console.error(err);
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        return next();
    }
};

export const getPostById = async (req, res, next) => {
    try {
        const postId = req.query.id; // Assuming the post ID is passed as a parameter in the request

        // Find the post by ID
        const post = await PostModel.findById(postId);

        if (!post) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Post not found"
            };
        } else {
            res.locals.status = 200;
            res.locals.data = {
                message: "Post found successfully",
                post
            };
        }

        return next();
    } catch (err) {
        console.error(err);
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error"
        };
        return next();
    }
};

export const updatePost = async (req, res, next) => {
    try {
        // Destructure fields that can be updated
        const { postId, title, subTitle, content, tags, jwtAccount } = req.body;

        // Check if at least one field is provided for update
        if (!title && !subTitle && !content && !tags) {
            res.locals.status = 400;
            res.locals.data = {
                message: 'No fields provided for update. At least one field (title, subTitle, or content) is required.',
            };
            return next();
        }

        // Check if userId matches the userId of the post
        const existingPost = await PostModel.findById(postId);

        if (!existingPost) {
            res.locals.status = 404;
            res.locals.data = {
                message: 'Post not found',
            };
            return next();
        }

        if (jwtAccount.account !== existingPost.userId) {
            res.locals.status = 403;
            res.locals.data = {
                message: 'User is not authorized to update this post',
            };
            return next();
        }

        // Construct update object based on provided fields
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (subTitle !== undefined) updateFields.subTitle = subTitle;
        if (content !== undefined) updateFields.content = content;
        if (tags !== undefined) updateFields.tags = tags;

        // Update the post
        const updatedPost = await PostModel.findByIdAndUpdate(postId, { $set: updateFields }, { new: true });

        if (!updatedPost) {
            res.locals.status = 404;
            res.locals.data = {
                message: 'Post not found',
            };
            return next();
        }

        res.locals.status = 200;
        res.locals.data = {
            message: 'Post updated successfully',
        };
        return next();
    } catch (error) {
        console.error(error);
        res.locals.status = 500;
        res.locals.data = {
            message: 'Server Error',
        };
        return next();
    }
};

export const updateResponse = async (req, res, next) => {
    try {
        // Destructure fields that can be updated
        const { responseId, content, jwtAccount } = req.body;

        // Check if at least one field is provided for update
        if (!content) {
            res.locals.status = 400;
            res.locals.data = {
                message: 'No fields provided for update. At least one field is required.',
            };
            return next();
        }

        // Check if userId matches the userId of the post
        const existingResponse = await ResponseModel.findById(responseId);

        if (!existingResponse) {
            res.locals.status = 404;
            res.locals.data = {
                message: 'Post not found',
            };
            return next();
        }

        if (jwtAccount.account !== existingResponse.userId) {
            res.locals.status = 403;
            res.locals.data = {
                message: 'User is not authorized to update this response',
            };
            return next();
        }

        // Construct update object based on provided fields
        const updateFields = {};
        if (content !== undefined) updateFields.content = content;

        // Update the post
        const updateResponse = await ResponseModel.findByIdAndUpdate(responseId, { $set: updateFields }, { new: true });

        if (!updateResponse) {
            res.locals.status = 404;
            res.locals.data = {
                message: 'Response not found',
            };
            return next();
        }

        res.locals.status = 200;
        res.locals.data = {
            message: 'Response updated successfully',
        };
        return next();
    } catch (error) {
        console.error(error);
        res.locals.status = 500;
        res.locals.data = {
            message: 'Server Error',
        };
        return next();
    }
};

// Helper function to calculate the percentage of matching letters
const calculateMatchPercentage = (str1, str2) => {
    const minLength = Math.min(str1.length, str2.length);
    let matchingCount = 0;

    for (let i = 0; i < minLength; i++) {
        if (str1[i].toLowerCase() === str2[i].toLowerCase()) {
            matchingCount++;
        }
    }

    return (matchingCount / minLength) * 100;
};

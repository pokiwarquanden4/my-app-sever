import { AdvertModel } from "../../models/advertisementModel.js";
import { PostModel } from "../../models/postModel.js";
import { ReportModel } from "../../models/reportModel.js";
import { UserModel } from "../../models/userModel.js";
import { createFireBaseImg } from "../FireBaseControllers/FireBaseControllers.js";

export const getAdverts = async (req, res, next) => {
    try {
        const { page = 1, type, searchVal } = req.query;

        // Initialize the query object
        let query = {};
        const currentTime = new Date();

        // Handle pagination
        const skip = (parseInt(page) - 1) * 10;

        // Determine the query based on the 'type' parameter
        switch (type) {
            case 'Newest':
                query = { endTimeA: { $gte: currentTime } };
                break;
            case 'Expired':
                query = { endTimeA: { $lt: currentTime } };
                break;
            case 'Active':
                query = { startTimeA: { $lte: currentTime }, endTimeA: { $gte: currentTime } };
                break;
            default:
                res.locals.status = 400;
                res.locals.data = {
                    message: "Invalid type parameter"
                };
                return next();
        }

        // Add search logic if searchVal is provided
        if (searchVal) {
            query.name = { $regex: searchVal, $options: 'i' };
        }

        const adverts = await AdvertModel.find(query)
            .skip(skip)
            .limit(10);

        // Execute a separate query to get the total count
        const totalCount = await AdvertModel.countDocuments(query);

        res.locals.status = 200;
        res.locals.data = {
            message: "Advertisements retrieved successfully",
            advert: adverts,
            totalCount: totalCount
        };
        return next();
    } catch (err) {
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error",
            error: err.message
        };
        return next();
    }
};

export const createAdvert = async (req, res, next) => {
    try {
        const { endTimeA, startTimeA, name, url } = req.body;

        // Validate required fields
        if (!endTimeA || !startTimeA || !name || !req.file) {
            res.locals.status = 400;
            res.locals.data = {
                message: "Missing required fields"
            };
            return next();
        }

        const imgURL = await createFireBaseImg('advert', req.file)
        console.log(imgURL)
        // Create a new advertisement
        const newAdvert = new AdvertModel({
            endTimeA,
            startTimeA,
            name,
            imgURL,
            url
        });

        // Save the advertisement to the database
        await newAdvert.save();

        res.locals.status = 200;
        res.locals.data = {
            message: "Advertisement created successfully",
            advert: newAdvert
        };
        return next();
    } catch (err) {
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error",
            error: err.message
        };
        return next();
    }
};

export const updateAdvert = async (req, res, next) => {
    try {
        const { advertId, endTimeA, startTimeA, name, url } = req.body;

        // Validate required fields
        if (!endTimeA || !startTimeA || !name || !url) {
            res.locals.status = 400;
            res.locals.data = {
                message: "Missing required fields"
            };
            return next();
        }

        // Find and update the advertisement
        const imgURL = await createFireBaseImg('advert', req.file)
        let updatedAdvert
        if (imgURL) {
            updatedAdvert = await AdvertModel.findByIdAndUpdate(
                advertId,
                { endTimeA, startTimeA, name, imgURL, url },
                { new: true, runValidators: true }
            );
        } else {
            updatedAdvert = await AdvertModel.findByIdAndUpdate(
                advertId,
                { endTimeA, startTimeA, name, url },
                { new: true, runValidators: true }
            );
        }

        // Check if advertisement was found and updated
        if (!updatedAdvert) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Advertisement not found"
            };
            return next();
        }

        res.locals.status = 200;
        res.locals.data = {
            message: "Advertisement updated successfully",
            advert: updatedAdvert
        };
        return next();
    } catch (err) {
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error",
            error: err.message
        };
        return next();
    }
};

export const getAllAdvert = async (req, res, next) => {
    try {
        const currentTime = new Date();

        // Find adverts with current time between startTimeA and endTimeA, selecting only name, imgURL, and url fields
        const adverts = await AdvertModel.find({
            startTimeA: { $lte: currentTime },
            endTimeA: { $gte: currentTime }
        }).select('name imgURL url');

        res.locals.status = 200;
        res.locals.data = {
            message: "Advertisements retrieved successfully",
            adverts: adverts
        };
        return next();
    } catch (err) {
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error",
            error: err.message
        };
        return next();
    }
};

export const createReport = async (req, res, next) => {
    try {
        const { jwtAccount, reason, postId } = req.body;

        // Validate the required fields
        if (!postId) {
            res.locals.status = 400;
            res.locals.data = {
                message: "Missing required fields",
            };
            return next();
        }

        //Get the user
        const user = await UserModel.findOne({ account: jwtAccount.account })
        if (!user) {
            res.locals.status = 401;
            res.locals.data = {
                message: "Unauthorize",
            };
            return next();
        }

        //Get the user
        const post = await PostModel.findById(postId).populate({ path: 'userId', select: 'account' })
        if (!post) {
            res.locals.status = 401;
            res.locals.data = {
                message: "Can not find post",
            };
            return next();
        }

        // Create a new report
        const newReport = new ReportModel({
            reportAccount: user._id,
            postOwner: post.userId,
            reason,
            reportedPost: post._id,
        });

        // Save the report to the database
        await newReport.save();

        const report = await ReportModel.findById(newReport._id)
            .populate({ path: 'reportAccount', select: 'account' })
            .populate({ path: 'postOwner', select: 'account' })

        res.locals.status = 200;
        res.locals.data = {
            message: "Report created successfully",
            report: report,
        };
        return next();
    } catch (err) {
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error",
            error: err.message,
        };
        return next();
    }
};

export const getReports = async (req, res, next) => {
    try {
        const { page, type, searchVal } = req.query;

        let query = {};

        // Handle pagination based on the 'number' parameter
        const skip = (parseInt(page) - 1) * 10;

        // Determine the query based on the 'type' parameter
        switch (type) {
            case 'Newest':
                query = {}; // Fetch posts with status 1 (assuming it means Newest)
                break;
            case 'Reject':
                query = { status: 1 }; // Fetch posts with status 2 (Rejected)
                break;
            case 'Accept':
                query = { status: 2 }; // Fetch posts with status 3 (Accepted)
                break;
            default:
                res.locals.status = 400;
                res.locals.data = {
                    message: "Invalid type parameter"
                };
                return next();
        }

        // Execute the query to get the paginated posts
        let reports = [];
        let totalCount = 0;

        reports = await ReportModel.find(query)
            .skip(skip)
            .limit(10)
            .select({
                _id: 1,
                reportAccount: 1,
                postOwner: 1,
                reason: 1,
                status: 1,
                reportedPost: 1,
            })
            .populate({ path: 'reportAccount', select: 'account' })
            .populate({ path: 'postOwner', select: 'account' });

        // Execute a separate query to get the total count
        totalCount = await ReportModel.countDocuments(query);

        // Custom filtering based on searchVal
        if (searchVal) {
            reports = reports.filter(report => {
                const titleMatch = calculateMatchPercentage(report.reportAccount.account, searchVal) > 50;
                const subTitleMatch = calculateMatchPercentage(report.postOwner.account, searchVal) > 50;
                const resoneMatch = calculateMatchPercentage(report.reason, searchVal) > 50;
                return titleMatch || subTitleMatch || resoneMatch;
            });

            totalCount = reports.length;
        }

        res.locals.status = 200;
        res.locals.data = {
            reports: reports,
            totalCount: totalCount
        };
        return next();
    } catch (err) {
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error",
            error: err.message,
        };
        return next();
    }
};

export const updateReport = async (req, res, next) => {
    try {
        const { reportId, status } = req.body;

        // Validate the required fields
        if (!reportId) {
            res.locals.status = 400;
            res.locals.data = {
                message: "Report ID is required",
            };
            return next();
        }

        // Find the report by ID
        let report = await ReportModel.findById(reportId);
        if (!report) {
            res.locals.status = 404;
            res.locals.data = {
                message: "Report not found",
            };
            return next();
        }

        // Update the report fields
        if (status !== undefined) {
            report.status = status;
        }

        // Save the updated report
        await report.save();

        res.locals.status = 200;
        res.locals.data = {
            message: "Report updated successfully",
            report,
        };
        return next();
    } catch (err) {
        res.locals.status = 500;
        res.locals.data = {
            message: "Server Error",
            error: err.message,
        };
        return next();
    }
};


// Helper function to calculate the percentage of matching letters
export const calculateMatchPercentage = (str1, str2) => {
    const minLength = Math.min(str1.length, str2.length);
    let matchingCount = 0;

    for (let i = 0; i < minLength; i++) {
        if (str1[i].toLowerCase() === str2[i].toLowerCase()) {
            matchingCount++;
        }
    }

    return (matchingCount / minLength) * 100;
};

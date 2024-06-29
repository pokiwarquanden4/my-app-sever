import { AdvertModel } from "../../models/advertisementModel.js";
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
import express from "express";
import { jwtMiddlewareController } from '../middleware/jwtMiddleware.js'
import { handleResponseWithJWTMiddleware } from "../JwtService/jwtService.js";
import { createAdvert, createReport, getAdverts, getAllAdvert, getReports, updateAdvert, updateReport } from "../controllers/adminControllers/adminControllers.js";
import multer from "multer";
const upload = multer();

const adminRoutes = express.Router();

adminRoutes.get("/advert", jwtMiddlewareController, getAdverts, handleResponseWithJWTMiddleware);

adminRoutes.get("/report", jwtMiddlewareController, getReports, handleResponseWithJWTMiddleware);

adminRoutes.post("/report/create", jwtMiddlewareController, createReport, handleResponseWithJWTMiddleware);

adminRoutes.put("/report/update", jwtMiddlewareController, updateReport, handleResponseWithJWTMiddleware);

adminRoutes.post("/advert/create", jwtMiddlewareController, upload.single('img'), createAdvert, handleResponseWithJWTMiddleware);

adminRoutes.put("/advert/update", jwtMiddlewareController, upload.single('img'), updateAdvert, handleResponseWithJWTMiddleware);

adminRoutes.get("/advert/simpleAdverts", jwtMiddlewareController, getAllAdvert, handleResponseWithJWTMiddleware);


export default adminRoutes;

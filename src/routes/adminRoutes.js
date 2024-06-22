import express from "express";
import { jwtMiddlewareController } from '../middleware/jwtMiddleware.js'
import { handleResponseWithJWTMiddleware } from "../JwtService/jwtService.js";
import { createAdvert, getAdverts, getAllAdvert, updateAdvert } from "../controllers/adminControllers/adminControllers.js";
import multer from "multer";
const upload = multer();

const adminRoutes = express.Router();

adminRoutes.get("/advert", jwtMiddlewareController, getAdverts, handleResponseWithJWTMiddleware);

adminRoutes.post("/advert/create", jwtMiddlewareController, upload.single('img'), createAdvert, handleResponseWithJWTMiddleware);

adminRoutes.put("/advert/update", jwtMiddlewareController, updateAdvert, handleResponseWithJWTMiddleware);

adminRoutes.get("/advert/simpleAdverts", jwtMiddlewareController, getAllAdvert, handleResponseWithJWTMiddleware);


export default adminRoutes;

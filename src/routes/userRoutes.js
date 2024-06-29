import express from "express";
import {
  createUser,
  getProfile,
  getUser,
  getUserDetails,
  loginUser,
  updateProfile
} from "../controllers/userControllers/userControllers.js";
import { jwtMiddlewareController } from '../middleware/jwtMiddleware.js'
import { handleResponseWithJWTMiddleware } from "../JwtService/jwtService.js";
import multer from "multer";
const upload = multer();

const userRoutes = express.Router();

userRoutes.post("/create/account", jwtMiddlewareController, upload.single('img'), createUser, handleResponseWithJWTMiddleware);

userRoutes.post("/login", jwtMiddlewareController, loginUser, handleResponseWithJWTMiddleware);

userRoutes.get("/getUser", jwtMiddlewareController, getUser, handleResponseWithJWTMiddleware);

userRoutes.get("/getUser/details", jwtMiddlewareController, getUserDetails, handleResponseWithJWTMiddleware);

userRoutes.get("/profile", jwtMiddlewareController, getProfile, handleResponseWithJWTMiddleware);

userRoutes.put("/profile/update", jwtMiddlewareController, upload.single('img'), updateProfile, handleResponseWithJWTMiddleware);


export default userRoutes;

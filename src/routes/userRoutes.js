import express from "express";
import {
  checkNotify,
  createOTPCode,
  createUser,
  getAllNotify,
  getProfile,
  getUser,
  getUserDetails,
  getUsersSimpleData,
  loginUser,
  updateProfile,
  verifyOTP
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

userRoutes.put("/profile/update", upload.single('img'), jwtMiddlewareController, updateProfile, handleResponseWithJWTMiddleware);

userRoutes.get("/getUsersSimpleData", jwtMiddlewareController, getUsersSimpleData, handleResponseWithJWTMiddleware);

userRoutes.get("/getNotify", jwtMiddlewareController, getAllNotify, handleResponseWithJWTMiddleware);

userRoutes.put("/checkNotify", jwtMiddlewareController, checkNotify, handleResponseWithJWTMiddleware);

userRoutes.post("/otp/create", jwtMiddlewareController, createOTPCode, handleResponseWithJWTMiddleware);

userRoutes.post("/otp/vertify", jwtMiddlewareController, verifyOTP, handleResponseWithJWTMiddleware);

export default userRoutes;

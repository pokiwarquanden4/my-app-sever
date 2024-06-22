import express from "express";
import {
  createUser,
  getUser,
  getUserDetails,
  loginUser
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

export default userRoutes;

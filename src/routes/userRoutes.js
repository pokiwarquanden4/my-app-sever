import express from "express";
import {
  createUser,
  getUser,
  loginUser
} from "../controllers/userControllers/userControllers.js";
import { jwtMiddlewareController } from '../middleware/jwtMiddleware.js'
import { handleResponseWithJWTMiddleware } from "../JwtService/jwtService.js";

const userRoutes = express.Router();

userRoutes.post("/create/account", jwtMiddlewareController, createUser, handleResponseWithJWTMiddleware);

userRoutes.post("/login", jwtMiddlewareController, loginUser, handleResponseWithJWTMiddleware);

export default userRoutes;

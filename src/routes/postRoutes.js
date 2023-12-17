import express from "express";
import { jwtMiddlewareController } from '../middleware/jwtMiddleware.js'
import { handleResponseWithJWTMiddleware } from "../JwtService/jwtService.js";
import { commentResponse, createPost, getAllComments, getAllResponses, getPosts, getTags, responsePost } from "../controllers/postControllers/postControllers.js";

const postRoutes = express.Router();

postRoutes.post("/create/post", jwtMiddlewareController, createPost, handleResponseWithJWTMiddleware);

postRoutes.post("/create/response", jwtMiddlewareController, responsePost, handleResponseWithJWTMiddleware);

postRoutes.post("/create/comment", jwtMiddlewareController, commentResponse, handleResponseWithJWTMiddleware);

postRoutes.get("/posts", jwtMiddlewareController, getPosts, handleResponseWithJWTMiddleware);

postRoutes.get("/tags", jwtMiddlewareController, getTags, handleResponseWithJWTMiddleware);

postRoutes.get("/responses", jwtMiddlewareController, getAllResponses, handleResponseWithJWTMiddleware);

postRoutes.get("/comments", jwtMiddlewareController, getAllComments, handleResponseWithJWTMiddleware);

export default postRoutes;

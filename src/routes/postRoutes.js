import express from "express";
import { jwtMiddlewareController } from '../middleware/jwtMiddleware.js'
import { handleResponseWithJWTMiddleware } from "../JwtService/jwtService.js";
import { commentResponse, createPost, getComments, getPostById, getPosts, getPostsBySearch, getResponses, getTags, responsePost, updatePost, updateResponse } from "../controllers/postControllers/postControllers.js";

const postRoutes = express.Router();

postRoutes.post("/create/post", jwtMiddlewareController, createPost, handleResponseWithJWTMiddleware);

postRoutes.post("/create/response", jwtMiddlewareController, responsePost, handleResponseWithJWTMiddleware);

postRoutes.post("/create/comment", jwtMiddlewareController, commentResponse, handleResponseWithJWTMiddleware);

postRoutes.get("/posts", jwtMiddlewareController, getPosts, handleResponseWithJWTMiddleware);

postRoutes.get("/post", jwtMiddlewareController, getPostById, handleResponseWithJWTMiddleware);

postRoutes.get("/search", jwtMiddlewareController, getPostsBySearch, handleResponseWithJWTMiddleware);

postRoutes.get("/tags", jwtMiddlewareController, getTags, handleResponseWithJWTMiddleware);

postRoutes.get("/responses", jwtMiddlewareController, getResponses, handleResponseWithJWTMiddleware);

postRoutes.get("/comments", jwtMiddlewareController, getComments, handleResponseWithJWTMiddleware);

postRoutes.put("/update/post", jwtMiddlewareController, updatePost, handleResponseWithJWTMiddleware);

postRoutes.put("/update/response", jwtMiddlewareController, updateResponse, handleResponseWithJWTMiddleware);

export default postRoutes;

import express from "express";
import { jwtMiddlewareController } from '../middleware/jwtMiddleware.js'
import { handleResponseWithJWTMiddleware } from "../JwtService/jwtService.js";
import { commentResponse, createPost, deletePostById, followPost, followResponse, getComments, getPostById, getPosts, getPostsBySearch, getResponses, getTags, ratePost, rateResponse, responsePost, unFollowPost, unFollowResponse, unRatePost, unRateResponse, updatePost, updateResponse, vertifyResponse } from "../controllers/postControllers/postControllers.js";

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

postRoutes.put("/update/response", jwtMiddlewareController, updateResponse, handleResponseWithJWTMiddleware);

postRoutes.put("/update/post", jwtMiddlewareController, updatePost, handleResponseWithJWTMiddleware);

postRoutes.post("/delete/post", jwtMiddlewareController, deletePostById, handleResponseWithJWTMiddleware);

postRoutes.post("/rate/post", jwtMiddlewareController, ratePost, handleResponseWithJWTMiddleware);

postRoutes.post("/rate/unPost", jwtMiddlewareController, unRatePost, handleResponseWithJWTMiddleware);

postRoutes.post("/rate/response", jwtMiddlewareController, rateResponse, handleResponseWithJWTMiddleware);

postRoutes.post("/rate/unResponse", jwtMiddlewareController, unRateResponse, handleResponseWithJWTMiddleware);

postRoutes.put("/vertify", jwtMiddlewareController, vertifyResponse, handleResponseWithJWTMiddleware);

postRoutes.post("/follow/post", jwtMiddlewareController, followPost, handleResponseWithJWTMiddleware);

postRoutes.post("/follow/response", jwtMiddlewareController, followResponse, handleResponseWithJWTMiddleware);

postRoutes.post("/follow/unPost", jwtMiddlewareController, unFollowPost, handleResponseWithJWTMiddleware);

postRoutes.post("/follow/unResponse", jwtMiddlewareController, unFollowResponse, handleResponseWithJWTMiddleware);

export default postRoutes;

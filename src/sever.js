import express from "express";
import routes from "./routes/index.js";
import connect from "./config/connectDB.js";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import socketService from "./socket/socket.js";
import http from "http";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//Socket IO
var server = http.createServer(app);
export const io = new Server(server, { cors: { origin: process.env.CLIENT_URL } });

//Socket service
socketService(io)

//Middleware, 30mb là giới hạn tối đa dung lượng client có thể submit lên server
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use("/uploads", express.static("src/uploads"));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
routes(app);

//DTB connect
connect();

server.listen(port, () => {
    console.log("Runing on the port : " + port);
});

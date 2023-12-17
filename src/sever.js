import express from "express";
import routes from "./routes/index.js";
import connect from "./config/connectDB.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware, 30mb là giới hạn tối đa dung lượng client có thể submit lên server
app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use("/uploads", express.static("src/uploads"));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
routes(app);

//DTB connect
connect();

app.listen(port, () => {
    console.log("Runing on the port : " + port);
});

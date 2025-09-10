import express from "express";
import cors from "cors";
import router from "./router";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", router);
export default app;

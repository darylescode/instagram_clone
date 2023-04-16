import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import * as dotenv from "dotenv";
import database from "./database";
import authRoutes from "./router/auth";
import userRoutes from './router/user';
import cookieParser from 'cookie-parser';
import authJWT from "./middleware/JWT";
import socketController from "./socket";
import { ErrorHandler } from "./helper/errorHandler";
import chatRoutes from "./router/chat";
import postRouter from "./router/post";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API = process.env.API;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(authJWT());
app.use(ErrorHandler);
app.use(morgan("tiny"));

// Routes
app.use(`${API}/`, authRoutes);
app.use(`${API}/chats`, chatRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/posts`, postRouter)

database.connect((error) => {
  if(error) throw error;
  console.log("Connected to MySQL Server!");
});

app.listen(PORT, () => {
  socketController();
  console.log("Connected", PORT);
});
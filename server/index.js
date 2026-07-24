import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";
import AuthRouter from './src/routers/authRouter.js'
import UserRouter from './src/routers/userRouter.js'
import AdminRouter from './src/routers/adminRouter.js'

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/auth",AuthRouter);
app.use("/user",UserRouter);
app.use("/admin" ,AdminRouter);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Server is sendig response" });
});

app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Something went wrong";
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({ message: ErrorMessage });
});

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server is started at port : ${PORT}`);
  connectDB();
});

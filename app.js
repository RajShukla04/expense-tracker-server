import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: "https://expense-tracker-server-production-0ed9.up.railway.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(urlencoded({ extended: true, limit: "16kb" }));

import userRouter from "./routes/user.route.js";
import dahboardRouter from "./routes/dashboard.route.js";
import expenseRouter from "./routes/expense.route.js";
app.use("/api/v1/usr", userRouter);
app.use("/api/v1/usr", dahboardRouter);
app.use("/api/v1/exp", expenseRouter);

export { app };

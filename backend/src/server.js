import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "taskflow-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
  const message =
    error.code === 11000
      ? "Duplicate value already exists"
      : error.message || "Something went wrong";

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack })
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`TaskFlow API running on port ${port}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

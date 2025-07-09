import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import urlRoutes from "./routes/url.routes";
import { loggerMiddleware } from "./middlewares/logger.middleware";

// Load environment variables
dotenv.config();

const app = express();
// Force use port 3001
process.env.PORT = "3001";
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
// Apply logger middleware
app.use(loggerMiddleware);

// Health check endpoint - moved above URL routes to avoid being caught by the catch-all route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/", urlRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/urlshortener")
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

export default app;

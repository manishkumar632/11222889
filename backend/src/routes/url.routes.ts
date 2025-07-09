import { Router } from "express";
import {
  createShortUrl,
  redirectToUrl,
  getUrlStats,
} from "../controllers/url.controller";
import { loggerMiddleware } from "../middlewares/logger.middleware";

const router = Router();

// Apply logger middleware to all routes
router.use(loggerMiddleware);

// Create a shortened URL
router.post("/shorturl", createShortUrl);

// Get stats for a shortened URL
router.get("/shorturls/:code", getUrlStats);

// Redirect to original URL
router.get("/:code", redirectToUrl);

export default router;

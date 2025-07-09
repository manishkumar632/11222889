import { Router } from "express";
import {
  createShortUrl,
  redirectToUrl,
  getUrlStats,
} from "../controllers/url.controller";

const router = Router();

// Create a shortened URL
router.post("/shorturl", createShortUrl);

// Get stats for a shortened URL
router.get("/shorturls/:code", getUrlStats);

// Redirect to original URL
router.get("/:code", redirectToUrl);

export default router;

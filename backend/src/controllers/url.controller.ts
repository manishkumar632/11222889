import { Request, Response } from "express";
import UrlModel, { IClickEvent } from "../models/url.model";
import {
  generateUniqueShortcode,
  validateCustomShortcode,
  isShortcodeAvailable,
} from "../utils/shortcode.util";
import { Logger, BackendPackage } from "../middlewares/logger.middleware";

// Default validity in minutes
const DEFAULT_VALIDITY_MINUTES = 30;

/**
 * Create a shortened URL
 * @route POST /shorturl
 */
export const createShortUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { url, validity, shortcode } = req.body;

    // Validate URL
    if (!url) {
      Logger.warn(BackendPackage.CONTROLLER, "Missing URL in request");
      res.status(400).json({ error: "URL is required" });
      return;
    }

    try {
      new URL(url);
    } catch (err) {
      Logger.warn(BackendPackage.CONTROLLER, `Invalid URL format: ${url}`);
      res.status(400).json({ error: "Invalid URL format" });
      return;
    }

    // Calculate expiry time
    const validityMinutes = validity
      ? parseInt(validity)
      : DEFAULT_VALIDITY_MINUTES;
    if (isNaN(validityMinutes) || validityMinutes <= 0) {
      Logger.warn(
        BackendPackage.CONTROLLER,
        `Invalid validity value: ${validity}`
      );
      res.status(400).json({ error: "Validity must be a positive number" });
      return;
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + validityMinutes);

    // Handle shortcode (custom or generated)
    let finalShortcode: string;
    let isCustom = false;

    if (shortcode) {
      // Validate custom shortcode format
      if (!validateCustomShortcode(shortcode)) {
        Logger.warn(
          BackendPackage.CONTROLLER,
          `Invalid custom shortcode format: ${shortcode}`
        );
        res.status(400).json({
          error:
            "Custom shortcode must be 4-12 characters and contain only alphanumeric characters",
        });
        return;
      }

      // Check if shortcode is available
      const isAvailable = await isShortcodeAvailable(shortcode);
      if (!isAvailable) {
        Logger.warn(
          BackendPackage.CONTROLLER,
          `Custom shortcode already exists: ${shortcode}`
        );
        res.status(409).json({ error: "Custom shortcode already exists" });
        return;
      }

      finalShortcode = shortcode;
      isCustom = true;
    } else {
      // Generate unique shortcode
      finalShortcode = await generateUniqueShortcode();
    }

    // Create the shortened URL in the database
    const newUrl = new UrlModel({
      originalUrl: url,
      shortCode: finalShortcode,
      expiresAt,
      isCustom,
    });

    await newUrl.save();

    Logger.info(
      BackendPackage.CONTROLLER,
      `Created short URL: ${finalShortcode} for ${url}`
    );

    res.status(201).json({
      originalUrl: url,
      shortCode: finalShortcode,
      shortUrl: `${req.protocol}://${req.get("host")}/${finalShortcode}`,
      expiresAt,
      isCustom,
    });
  } catch (error) {
    Logger.error(
      BackendPackage.CONTROLLER,
      `Error creating short URL: ${error}`
    );
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Redirect to original URL
 * @route GET /:code
 */
export const redirectToUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;

    const url = await UrlModel.findOne({ shortCode: code });

    // URL not found
    if (!url) {
      Logger.warn(BackendPackage.CONTROLLER, `Short URL not found: ${code}`);
      res.status(404).json({ error: "Short URL not found" });
      return;
    }

    // URL expired
    if (url.expiresAt < new Date()) {
      Logger.info(
        BackendPackage.CONTROLLER,
        `Short URL expired: ${code} (expired at ${url.expiresAt})`
      );
      res.status(410).json({ error: "Short URL has expired" });
      return;
    }

    // Record click event
    const clickEvent: IClickEvent = {
      timestamp: new Date(),
      referrer: req.get("referer") || "direct",
      geoInfo: {
        ip: req.ip,
        // In a real app, we would use a geo-ip service to get country and city
        country: "Unknown",
        city: "Unknown",
      },
    };

    url.clicks += 1;
    url.clickEvents.push(clickEvent);
    await url.save();

    Logger.info(
      BackendPackage.CONTROLLER,
      `Redirecting ${code} to ${url.originalUrl} (click count: ${url.clicks})`
    );

    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    Logger.error(BackendPackage.CONTROLLER, `Error redirecting: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get stats for a shortened URL
 * @route GET /shorturls/:code
 */
export const getUrlStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;

    const url = await UrlModel.findOne({ shortCode: code });

    // URL not found
    if (!url) {
      Logger.warn(BackendPackage.CONTROLLER, `Stats not found for: ${code}`);
      res.status(404).json({ error: "Short URL not found" });
      return;
    }

    Logger.info(BackendPackage.CONTROLLER, `Retrieved stats for ${code}`);

    // Return stats
    res.status(200).json({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      isExpired: url.expiresAt < new Date(),
      clicks: url.clicks,
      clickEvents: url.clickEvents,
    });
  } catch (error) {
    Logger.error(BackendPackage.CONTROLLER, `Error getting stats: ${error}`);
    res.status(500).json({ error: "Server error" });
  }
};

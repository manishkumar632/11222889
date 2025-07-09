import crypto from "crypto";
import { Logger, BackendPackage } from "../middlewares/logger.middleware";
import UrlModel from "../models/url.model";

/**
 * Generate a random shortcode of specified length
 * @param length Length of the shortcode (default: 6)
 * @returns Random shortcode
 */
export const generateRandomShortcode = (length: number = 6): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  // Using crypto for secure random generation
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(randomBytes[i] % chars.length));
  }

  return result;
};

/**
 * Generate a unique shortcode that doesn't exist in the database
 * @param length Length of the shortcode (default: 6)
 * @returns Promise resolving to a unique shortcode
 */
export const generateUniqueShortcode = async (
  length: number = 6
): Promise<string> => {
  let shortcode = generateRandomShortcode(length);
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Check if shortcode exists in database
    const existingUrl = await UrlModel.findOne({ shortCode: shortcode });

    if (!existingUrl) {
      isUnique = true;
    } else {
      shortcode = generateRandomShortcode(length);
      attempts++;

      Logger.info(
        BackendPackage.UTILS,
        `Generated shortcode already exists, retrying (attempt ${attempts})`
      );
    }
  }

  if (!isUnique) {
    Logger.error(
      BackendPackage.UTILS,
      `Failed to generate unique shortcode after ${maxAttempts} attempts`
    );
    throw new Error("Failed to generate unique shortcode");
  }

  return shortcode;
};

/**
 * Validate a custom shortcode
 * @param shortcode Custom shortcode to validate
 * @returns True if valid, false otherwise
 */
export const validateCustomShortcode = (shortcode: string): boolean => {
  // Only allow alphanumeric characters and length between 4-12 chars
  const regex = /^[a-zA-Z0-9]{4,12}$/;
  return regex.test(shortcode);
};

/**
 * Check if a shortcode is available
 * @param shortcode Shortcode to check
 * @returns Promise resolving to true if available, false otherwise
 */
export const isShortcodeAvailable = async (
  shortcode: string
): Promise<boolean> => {
  const existingUrl = await UrlModel.findOne({ shortCode: shortcode });
  return !existingUrl;
};

import axios from "axios";
import { Logger, FrontendPackage } from "../utils/logger";

// API base URL
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";

// URL interface from the backend
export interface UrlData {
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  expiresAt: string;
  isCustom: boolean;
}

// URL stats interface from the backend
export interface UrlStats extends UrlData {
  createdAt: string;
  isExpired: boolean;
  clicks: number;
  clickEvents: {
    timestamp: string;
    referrer: string;
    geoInfo?: {
      country?: string;
      city?: string;
      ip?: string;
    };
  }[];
}

// API service for URL shortener
export const urlApi = {
  /**
   * Create a shortened URL
   * @param url Original URL to shorten
   * @param validity Optional validity in minutes
   * @param shortcode Optional custom shortcode
   * @returns Promise with the created URL data
   */
  createShortUrl: async (
    url: string,
    validity?: number,
    shortcode?: string
  ): Promise<UrlData> => {
    try {
      Logger.info(FrontendPackage.API, `Creating short URL for: ${url}`);

      const response = await axios.post(`${API_BASE_URL}/shorturl`, {
        url,
        validity,
        shortcode,
      });

      Logger.info(
        FrontendPackage.API,
        `Created short URL: ${response.data.shortCode}`
      );
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to create short URL";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Error ${error.response.status}: ${
          error.response.data.error || error.message
        }`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Logger.error(FrontendPackage.API, errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Get statistics for a shortened URL
   * @param code Shortcode to get statistics for
   * @returns Promise with the URL statistics
   */
  getUrlStats: async (code: string): Promise<UrlStats> => {
    try {
      Logger.info(FrontendPackage.API, `Fetching stats for: ${code}`);

      const response = await axios.get(`${API_BASE_URL}/shorturls/${code}`);

      Logger.info(FrontendPackage.API, `Retrieved stats for: ${code}`);
      return response.data;
    } catch (error) {
      let errorMessage = `Failed to get stats for ${code}`;

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Error ${error.response.status}: ${
          error.response.data.error || error.message
        }`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Logger.error(FrontendPackage.API, errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Get statistics for all shortened URLs (not a backend endpoint, this simulates it)
   * @returns Promise with all URL statistics
   */
  getAllUrlStats: async (): Promise<UrlStats[]> => {
    try {
      Logger.info(FrontendPackage.API, "Fetching all URL stats");

      // For demo purposes, we'll assume there's a local storage mechanism
      // In a real app, this would be a proper API endpoint
      const storedUrls = localStorage.getItem("shortUrlHistory");
      const urls: string[] = storedUrls ? JSON.parse(storedUrls) : [];

      // Fetch stats for each URL
      const statsPromises = urls.map((code) => urlApi.getUrlStats(code));
      const stats = await Promise.all(statsPromises);

      Logger.info(
        FrontendPackage.API,
        `Retrieved stats for ${stats.length} URLs`
      );
      return stats;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get all URL stats";
      Logger.error(FrontendPackage.API, errorMessage);
      throw new Error(errorMessage);
    }
  },
};

export default urlApi;

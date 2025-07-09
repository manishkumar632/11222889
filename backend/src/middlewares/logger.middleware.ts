import { Request, Response, NextFunction } from "express";
import {
  Logger,
  LogLevel,
  Stack,
  BackendPackage as ImportedBackendPackage,
} from "logging-middleware";

// Extended BackendPackage enum with UTILS
export enum BackendPackage {
  CACHE = "cache",
  CONTROLLER = "controller",
  CRON_JOB = "cron_job",
  DB = "db",
  DOMAIN = "domain",
  HANDLER = "handler",
  REPOSITORY = "repository",
  ROUTE = "route",
  SERVICE = "service",
  UTILS = "utils",
}

// Create our own logger middleware wrapper that works with Express types
export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = new Date();

  // Log request
  Logger.info(
    BackendPackage.HANDLER,
    `Request received: ${req.method} ${req.originalUrl}`
  );

  // Intercept the response to log after it's complete
  const originalSend = res.send;
  res.send = function (body: any): Response {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    // Log response
    Logger.info(
      BackendPackage.HANDLER,
      `Response sent: ${res.statusCode} (took ${duration}ms)`
    );

    return originalSend.call(this, body);
  };

  next();
};

// Export everything else from the shared package
export { Logger, LogLevel, Stack };

export default Logger;

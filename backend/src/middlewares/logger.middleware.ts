import { Request, Response, NextFunction } from "express";
import {
  Logger as ImportedLogger,
  LogLevel,
  Stack,
  BackendPackage as ImportedBackendPackage,
  SharedPackage,
  Package as ImportedPackage,
  FrontendPackage,
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

// Type for our package to work with the logging-middleware
export type Package = BackendPackage | FrontendPackage | SharedPackage;

// Create our own Logger wrapper that works with our BackendPackage
export class Logger {
  public static debug(pkg: Package, message: string, stack?: Stack): void {
    ImportedLogger.debug(pkg as ImportedPackage, message, stack);
  }

  public static info(pkg: Package, message: string, stack?: Stack): void {
    ImportedLogger.info(pkg as ImportedPackage, message, stack);
  }

  public static warn(pkg: Package, message: string, stack?: Stack): void {
    ImportedLogger.warn(pkg as ImportedPackage, message, stack);
  }

  public static error(pkg: Package, message: string, stack?: Stack): void {
    ImportedLogger.error(pkg as ImportedPackage, message, stack);
  }

  public static fatal(pkg: Package, message: string, stack?: Stack): void {
    ImportedLogger.fatal(pkg as ImportedPackage, message, stack);
  }

  public static setAuthToken(token: string): void {
    ImportedLogger.setAuthToken(token);
  }

  public static setLoggingApi(url: string): void {
    ImportedLogger.setLoggingApi(url);
  }
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
export { LogLevel, Stack, FrontendPackage, SharedPackage };

export default Logger;

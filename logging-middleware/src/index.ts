import axios from "axios";
import { Request, Response, NextFunction } from "express";

// Logging levels as specified in requirements
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

// Stack values as specified in requirements
export enum Stack {
  BACKEND = "backend",
  FRONTEND = "frontend",
}

// Packages as specified in requirements
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
}

export enum FrontendPackage {
  API = "api",
  COMPONENT = "component",
  HOOK = "hook",
  PAGE = "page",
  STATE = "state",
  STYLE = "style",
}

export enum SharedPackage {
  AUTH = "auth",
  CONFIG = "config",
  MIDDLEWARE = "middleware",
  UTILS = "utils",
}

// Combined Package type for all valid packages
export type Package = BackendPackage | FrontendPackage | SharedPackage;

// Log interface
interface Log {
  stack: Stack;
  level: LogLevel;
  package: Package | string;
  message: string;
}

// Logger class that can be used across the application
export class Logger {
  private static loggingApi = "http://20.244.56.144/evaluation-service/logs";
  private static authToken: string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtYW5pc2htdTYzMkBnbWFpbC5jb20iLCJleHAiOjE3NTIwNTM0MDUsImlhdCI6MTc1MjA1MjUwNSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImJlZWMyZGNlLTlhZjgtNGY0Zi04Zjk4LWQyMzZhYWQ4MmYwMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1hbmlzaCBtdWtoaXlhIiwic3ViIjoiOWY1YTlkOGEtZjA3Yy00MGQxLTk1M2MtOTE2YzkwMjllMGVkIn0sImVtYWlsIjoibWFuaXNobXU2MzJAZ21haWwuY29tIiwibmFtZSI6Im1hbmlzaCBtdWtoaXlhIiwicm9sbE5vIjoiMTEyMjI4ODkiLCJhY2Nlc3NDb2RlIjoiVkNhVlJtIiwiY2xpZW50SUQiOiI5ZjVhOWQ4YS1mMDdjLTQwZDEtOTUzYy05MTZjOTAyOWUwZWQiLCJjbGllbnRTZWNyZXQiOiJBdGtBSnBwTlliSnFGYXViIn0.TNVBEZrUk-deKi4q2Yy2W166m9oYfELvMf_vtXR6ftY";

  /**
   * Set the authentication token for API requests
   * @param token Bearer token for authorization
   */
  public static setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Set the logging API endpoint
   * @param url URL of the logging API endpoint
   */
  public static setLoggingApi(url: string): void {
    this.loggingApi = url;
  }

  /**
   * Send log to logging API
   * @param log Log object to send
   */
  private static async sendLog(log: Log): Promise<void> {
    try {
      const headers = {
        Authorization: `Bearer ${this.authToken}`,
      };

      await axios.post(this.loggingApi, log, { headers });
    } catch (error) {
      // If logging API fails, we don't want to crash the application
      // This would typically be where we'd use console.log, but we're avoiding it as per requirements
    }
  }

  /**
   * Log debug message
   * @param pkg Package name
   * @param message Log message
   * @param stack Stack (defaults based on package type)
   */
  static debug(pkg: Package, message: string, stack?: Stack): void {
    this.sendLog({
      stack: stack || this.determineStack(pkg),
      level: LogLevel.DEBUG,
      package: pkg,
      message,
    });
  }

  /**
   * Log info message
   * @param pkg Package name
   * @param message Log message
   * @param stack Stack (defaults based on package type)
   */
  static info(pkg: Package, message: string, stack?: Stack): void {
    this.sendLog({
      stack: stack || this.determineStack(pkg),
      level: LogLevel.INFO,
      package: pkg,
      message,
    });
  }

  /**
   * Log warning message
   * @param pkg Package name
   * @param message Log message
   * @param stack Stack (defaults based on package type)
   */
  static warn(pkg: Package, message: string, stack?: Stack): void {
    this.sendLog({
      stack: stack || this.determineStack(pkg),
      level: LogLevel.WARN,
      package: pkg,
      message,
    });
  }

  /**
   * Log error message
   * @param pkg Package name
   * @param message Log message
   * @param stack Stack (defaults based on package type)
   */
  static error(pkg: Package, message: string, stack?: Stack): void {
    this.sendLog({
      stack: stack || this.determineStack(pkg),
      level: LogLevel.ERROR,
      package: pkg,
      message,
    });
  }

  /**
   * Log fatal message
   * @param pkg Package name
   * @param message Log message
   * @param stack Stack (defaults based on package type)
   */
  static fatal(pkg: Package, message: string, stack?: Stack): void {
    this.sendLog({
      stack: stack || this.determineStack(pkg),
      level: LogLevel.FATAL,
      package: pkg,
      message,
    });
  }

  /**
   * Determine stack based on package type
   * @param pkg Package name
   * @returns Stack type
   */
  private static determineStack(pkg: Package): Stack {
    if (Object.values(BackendPackage).includes(pkg as BackendPackage)) {
      return Stack.BACKEND;
    } else if (
      Object.values(FrontendPackage).includes(pkg as FrontendPackage)
    ) {
      return Stack.FRONTEND;
    }

    // For shared packages, default to backend (can be overridden by caller)
    return Stack.BACKEND;
  }
}

/**
 * Express middleware for logging requests
 */
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

export default Logger;

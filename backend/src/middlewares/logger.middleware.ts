import axios from "axios";
import { Request, Response, NextFunction } from "express";

// Logging levels as specified in requirements
export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

// Packages as specified in requirements for backend
export enum BackendPackage {
  UTILS = "utils",
  HANDLER = "handler",
  CONTROLLER = "controller",
}

// Stack values as specified in requirements
export enum Stack {
  BACKEND = "backend",
  FRONTEND = "frontend",
}

// Log interface
interface Log {
  stack: Stack;
  level: LogLevel;
  package: BackendPackage | string;
  message: string;
}

// Logger class that can be used across the application
export class Logger {
  private static readonly loggingApi =
    process.env.LOGGING_API || "http://20.244.55.144/evaluation-service/logs";

  /**
   * Send log to logging API
   * @param log Log object to send
   */
  private static async sendLog(log: Log): Promise<void> {
    try {
      await axios.post(this.loggingApi, log);
    } catch (error) {
      // If logging API fails, we don't want to crash the application
      // This would typically be where we'd use console.log, but we're avoiding it as per requirements
      // In a real application, we might have a fallback logging mechanism
    }
  }

  /**
   * Log info message
   * @param pkg Package name
   * @param message Log message
   * @param stack Stack (default: backend)
   */
  static info(
    pkg: BackendPackage,
    message: string,
    stack: Stack = Stack.BACKEND
  ): void {
    this.sendLog({
      stack,
      level: LogLevel.INFO,
      package: pkg,
      message,
    });
  }

  /**
   * Log warning message
   * @param pkg Package name
   * @param message Log message
   * @param stack Stack (default: backend)
   */
  static warn(
    pkg: BackendPackage,
    message: string,
    stack: Stack = Stack.BACKEND
  ): void {
    this.sendLog({
      stack,
      level: LogLevel.WARN,
      package: pkg,
      message,
    });
  }

  /**
   * Log error message
   * @param pkg Package name
   * @param message Log message
   * @param stack Stack (default: backend)
   */
  static error(
    pkg: BackendPackage,
    message: string,
    stack: Stack = Stack.BACKEND
  ): void {
    this.sendLog({
      stack,
      level: LogLevel.ERROR,
      package: pkg,
      message,
    });
  }

  /**
   * Log fatal message
   * @param pkg Package name
   * @param message Log message
   * @param stack Stack (default: backend)
   */
  static fatal(
    pkg: BackendPackage,
    message: string,
    stack: Stack = Stack.BACKEND
  ): void {
    this.sendLog({
      stack,
      level: LogLevel.FATAL,
      package: pkg,
      message,
    });
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
  res.send = function (body): Response {
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

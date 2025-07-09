import axios from "axios";

// Logging levels as specified in requirements
export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  FATAL = "fatal",
}

// Packages as specified in requirements for frontend
export enum FrontendPackage {
  COMPONENT = "component",
  API = "api",
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
  package: FrontendPackage | string;
  message: string;
}

// Logger class that can be used across the application
export class Logger {
  private static readonly loggingApi =
    process.env.REACT_APP_LOGGING_API ||
    "http://20.244.55.144/evaluation-service/logs";

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
    }
  }

  /**
   * Log info message
   * @param pkg Package name
   * @param message Log message
   */
  static info(pkg: FrontendPackage, message: string): void {
    this.sendLog({
      stack: Stack.FRONTEND,
      level: LogLevel.INFO,
      package: pkg,
      message,
    });
  }

  /**
   * Log warning message
   * @param pkg Package name
   * @param message Log message
   */
  static warn(pkg: FrontendPackage, message: string): void {
    this.sendLog({
      stack: Stack.FRONTEND,
      level: LogLevel.WARN,
      package: pkg,
      message,
    });
  }

  /**
   * Log error message
   * @param pkg Package name
   * @param message Log message
   */
  static error(pkg: FrontendPackage, message: string): void {
    this.sendLog({
      stack: Stack.FRONTEND,
      level: LogLevel.ERROR,
      package: pkg,
      message,
    });
  }

  /**
   * Log fatal message
   * @param pkg Package name
   * @param message Log message
   */
  static fatal(pkg: FrontendPackage, message: string): void {
    this.sendLog({
      stack: Stack.FRONTEND,
      level: LogLevel.FATAL,
      package: pkg,
      message,
    });
  }
}

export default Logger;

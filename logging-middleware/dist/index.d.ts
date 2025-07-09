import { Request, Response, NextFunction } from "express";
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal"
}
export declare enum Stack {
    BACKEND = "backend",
    FRONTEND = "frontend"
}
export declare enum BackendPackage {
    CACHE = "cache",
    CONTROLLER = "controller",
    CRON_JOB = "cron_job",
    DB = "db",
    DOMAIN = "domain",
    HANDLER = "handler",
    REPOSITORY = "repository",
    ROUTE = "route",
    SERVICE = "service"
}
export declare enum FrontendPackage {
    API = "api",
    COMPONENT = "component",
    HOOK = "hook",
    PAGE = "page",
    STATE = "state",
    STYLE = "style"
}
export declare enum SharedPackage {
    AUTH = "auth",
    CONFIG = "config",
    MIDDLEWARE = "middleware",
    UTILS = "utils"
}
export type Package = BackendPackage | FrontendPackage | SharedPackage;
export declare class Logger {
    private static loggingApi;
    private static authToken;
    /**
     * Set the authentication token for API requests
     * @param token Bearer token for authorization
     */
    static setAuthToken(token: string): void;
    /**
     * Set the logging API endpoint
     * @param url URL of the logging API endpoint
     */
    static setLoggingApi(url: string): void;
    /**
     * Send log to logging API
     * @param log Log object to send
     */
    private static sendLog;
    /**
     * Log debug message
     * @param pkg Package name
     * @param message Log message
     * @param stack Stack (defaults based on package type)
     */
    static debug(pkg: Package, message: string, stack?: Stack): void;
    /**
     * Log info message
     * @param pkg Package name
     * @param message Log message
     * @param stack Stack (defaults based on package type)
     */
    static info(pkg: Package, message: string, stack?: Stack): void;
    /**
     * Log warning message
     * @param pkg Package name
     * @param message Log message
     * @param stack Stack (defaults based on package type)
     */
    static warn(pkg: Package, message: string, stack?: Stack): void;
    /**
     * Log error message
     * @param pkg Package name
     * @param message Log message
     * @param stack Stack (defaults based on package type)
     */
    static error(pkg: Package, message: string, stack?: Stack): void;
    /**
     * Log fatal message
     * @param pkg Package name
     * @param message Log message
     * @param stack Stack (defaults based on package type)
     */
    static fatal(pkg: Package, message: string, stack?: Stack): void;
    /**
     * Determine stack based on package type
     * @param pkg Package name
     * @returns Stack type
     */
    private static determineStack;
}
/**
 * Express middleware for logging requests
 */
export declare const loggerMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export default Logger;

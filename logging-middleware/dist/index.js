"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = exports.Logger = exports.SharedPackage = exports.FrontendPackage = exports.BackendPackage = exports.Stack = exports.LogLevel = void 0;
const axios_1 = __importDefault(require("axios"));
// Logging levels as specified in requirements
var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["FATAL"] = "fatal";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
// Stack values as specified in requirements
var Stack;
(function (Stack) {
    Stack["BACKEND"] = "backend";
    Stack["FRONTEND"] = "frontend";
})(Stack || (exports.Stack = Stack = {}));
// Packages as specified in requirements
var BackendPackage;
(function (BackendPackage) {
    BackendPackage["CACHE"] = "cache";
    BackendPackage["CONTROLLER"] = "controller";
    BackendPackage["CRON_JOB"] = "cron_job";
    BackendPackage["DB"] = "db";
    BackendPackage["DOMAIN"] = "domain";
    BackendPackage["HANDLER"] = "handler";
    BackendPackage["REPOSITORY"] = "repository";
    BackendPackage["ROUTE"] = "route";
    BackendPackage["SERVICE"] = "service";
})(BackendPackage || (exports.BackendPackage = BackendPackage = {}));
var FrontendPackage;
(function (FrontendPackage) {
    FrontendPackage["API"] = "api";
    FrontendPackage["COMPONENT"] = "component";
    FrontendPackage["HOOK"] = "hook";
    FrontendPackage["PAGE"] = "page";
    FrontendPackage["STATE"] = "state";
    FrontendPackage["STYLE"] = "style";
})(FrontendPackage || (exports.FrontendPackage = FrontendPackage = {}));
var SharedPackage;
(function (SharedPackage) {
    SharedPackage["AUTH"] = "auth";
    SharedPackage["CONFIG"] = "config";
    SharedPackage["MIDDLEWARE"] = "middleware";
    SharedPackage["UTILS"] = "utils";
})(SharedPackage || (exports.SharedPackage = SharedPackage = {}));
// Logger class that can be used across the application
class Logger {
    /**
     * Set the authentication token for API requests
     * @param token Bearer token for authorization
     */
    static setAuthToken(token) {
        this.authToken = token;
    }
    /**
     * Set the logging API endpoint
     * @param url URL of the logging API endpoint
     */
    static setLoggingApi(url) {
        this.loggingApi = url;
    }
    /**
     * Send log to logging API
     * @param log Log object to send
     */
    static async sendLog(log) {
        try {
            const headers = {
                Authorization: `Bearer ${this.authToken}`,
            };
            await axios_1.default.post(this.loggingApi, log, { headers });
        }
        catch (error) {
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
    static debug(pkg, message, stack) {
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
    static info(pkg, message, stack) {
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
    static warn(pkg, message, stack) {
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
    static error(pkg, message, stack) {
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
    static fatal(pkg, message, stack) {
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
    static determineStack(pkg) {
        if (Object.values(BackendPackage).includes(pkg)) {
            return Stack.BACKEND;
        }
        else if (Object.values(FrontendPackage).includes(pkg)) {
            return Stack.FRONTEND;
        }
        // For shared packages, default to backend (can be overridden by caller)
        return Stack.BACKEND;
    }
}
exports.Logger = Logger;
Logger.loggingApi = "http://20.244.56.144/evaluation-service/logs";
Logger.authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtYW5pc2htdTYzMkBnbWFpbC5jb20iLCJleHAiOjE3NTIwNTM0MDUsImlhdCI6MTc1MjA1MjUwNSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImJlZWMyZGNlLTlhZjgtNGY0Zi04Zjk4LWQyMzZhYWQ4MmYwMCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1hbmlzaCBtdWtoaXlhIiwic3ViIjoiOWY1YTlkOGEtZjA3Yy00MGQxLTk1M2MtOTE2YzkwMjllMGVkIn0sImVtYWlsIjoibWFuaXNobXU2MzJAZ21haWwuY29tIiwibmFtZSI6Im1hbmlzaCBtdWtoaXlhIiwicm9sbE5vIjoiMTEyMjI4ODkiLCJhY2Nlc3NDb2RlIjoiVkNhVlJtIiwiY2xpZW50SUQiOiI5ZjVhOWQ4YS1mMDdjLTQwZDEtOTUzYy05MTZjOTAyOWUwZWQiLCJjbGllbnRTZWNyZXQiOiJBdGtBSnBwTlliSnFGYXViIn0.TNVBEZrUk-deKi4q2Yy2W166m9oYfELvMf_vtXR6ftY";
/**
 * Express middleware for logging requests
 */
const loggerMiddleware = (req, res, next) => {
    const startTime = new Date();
    // Log request
    Logger.info(BackendPackage.HANDLER, `Request received: ${req.method} ${req.originalUrl}`);
    // Intercept the response to log after it's complete
    const originalSend = res.send;
    res.send = function (body) {
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();
        // Log response
        Logger.info(BackendPackage.HANDLER, `Response sent: ${res.statusCode} (took ${duration}ms)`);
        return originalSend.call(this, body);
    };
    next();
};
exports.loggerMiddleware = loggerMiddleware;
exports.default = Logger;

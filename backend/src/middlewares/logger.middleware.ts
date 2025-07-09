// Re-export from the logging-middleware package
import {
  Logger,
  LogLevel,
  Stack,
  BackendPackage,
  loggerMiddleware,
} from "logging-middleware";

// Export everything from the shared package
export { Logger, LogLevel, Stack, BackendPackage, loggerMiddleware };

export default Logger;

# Logging Middleware

A reusable TypeScript logging middleware that sends logs to a centralized API endpoint. This middleware can be used in both frontend and backend applications.

## Features

- Standardized logging levels (debug, info, warn, error, fatal)
- Support for both frontend and backend applications
- Express middleware for request/response logging
- Configurable logging endpoint
- Authorization token support

## Installation

```bash
npm install --save ../logging-middleware
```

## Usage

### Basic Usage

```typescript
import { Logger, BackendPackage } from "logging-middleware";

// Log messages
Logger.info(BackendPackage.CONTROLLER, "User login successful");
Logger.error(BackendPackage.DB, "Database connection failed");
```

### Setting Auth Token and API Endpoint

```typescript
import { Logger } from "logging-middleware";

// Set authorization token
Logger.setAuthToken("your-auth-token");

// Set custom logging API endpoint (optional)
Logger.setLoggingApi("https://your-logging-api.com/logs");
```

### Using the Express Middleware

```typescript
import express from "express";
import { loggerMiddleware } from "logging-middleware";

const app = express();

// Apply middleware to log all requests and responses
app.use(loggerMiddleware);
```

## API Reference

### Logger Methods

- `Logger.debug(package, message, stack?)` - Log debug message
- `Logger.info(package, message, stack?)` - Log info message
- `Logger.warn(package, message, stack?)` - Log warning message
- `Logger.error(package, message, stack?)` - Log error message
- `Logger.fatal(package, message, stack?)` - Log fatal message

### Configuration Methods

- `Logger.setAuthToken(token)` - Set authorization token
- `Logger.setLoggingApi(url)` - Set custom logging API endpoint

### Express Middleware

- `loggerMiddleware` - Express middleware that logs requests and responses

## Package Enums

The module provides enums for standardized package names:

- `BackendPackage` - Backend-specific package names
- `FrontendPackage` - Frontend-specific package names
- `SharedPackage` - Shared package names that can be used in both

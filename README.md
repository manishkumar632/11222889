# URL Shortener with Analytics

A full-stack URL shortener application with detailed analytics and centralized logging.

## Project Structure

- `/logging-middleware` - Shared logging package for both backend and frontend
- `/backend` - Express/TypeScript backend API
- `/frontend` - React/TypeScript frontend application

## Features

### Logging Middleware

- Standardized logging levels (debug, info, warn, error, fatal)
- Support for both frontend and backend applications
- Express middleware for request/response logging
- Configurable logging endpoint with authorization token

### Backend

- URL shortening service with custom shortcodes support
- Detailed analytics tracking (clicks, referrers, geo-info)
- Integrated logging middleware
- RESTful API endpoints

### Frontend

- URL shortener page with support for up to 5 URLs at once
- Statistics page showing all shortened URLs and their analytics
- Responsive Material UI design

## Setup Instructions

### Logging Middleware

1. Navigate to the logging-middleware directory:

   ```
   cd logging-middleware
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Build the package:
   ```
   npm run build
   ```

### Backend

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Link the logging-middleware package:

   ```
   npm link ../logging-middleware
   ```

4. Create a `.env` file with the following content:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/urlshortener
   ```

5. Start the development server:
   ```
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Link the logging-middleware package:

   ```
   npm link ../logging-middleware
   ```

4. Start the development server:
   ```
   npm start
   ```

## API Endpoints

- `POST /shorturl` - Create a shortened URL

  - Body: `{ url: string, validity?: number, shortcode?: string }`
  - Response: URL data with shortcode and expiry time

- `GET /shorturls/:code` - Get statistics for a shortened URL

  - Response: URL data with click stats and analytics

- `GET /:code` - Redirect to the original URL

## Technology Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Frontend**: React, TypeScript, Material UI
- **Logging**: Custom middleware sending logs to API endpoint

## Implementation Details

### Logging Middleware

The logging middleware is implemented as a reusable TypeScript package that can be used in both frontend and backend applications. It sends logs to the specified API endpoint with the following structure:

```typescript
interface Log {
  stack: "backend" | "frontend";
  level: "debug" | "info" | "warn" | "error" | "fatal";
  package: string; // Package name (controller, service, etc.)
  message: string; // Log message
}
```

The middleware ensures that all logs are sent with the appropriate authorization token and follows the required naming conventions for stack, level, and package names.

### Backend Implementation

The backend is implemented using Express and TypeScript with the following components:

- **Controllers**: Handle HTTP requests and responses
- **Models**: Define MongoDB schemas and interfaces
- **Routes**: Define API endpoints
- **Utils**: Helper functions for URL shortening

### Frontend Implementation

The frontend is implemented using React, TypeScript, and Material UI with the following components:

- **URL Shortener**: Allow users to shorten up to 5 URLs at once
- **URL Statistics**: Display analytics for shortened URLs
- **API Service**: Communicate with the backend API

## Testing

The application has been tested on both desktop and mobile devices to ensure a responsive user experience.

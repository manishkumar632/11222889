# URL Shortener with Analytics

A full-stack URL shortener application with detailed analytics and centralized logging.

## Project Structure

- `/backend` - Express/TypeScript backend API
- `/frontend` - React/TypeScript frontend application

## Features

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

### Backend

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following content:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/urlshortener
   LOGGING_API=http://20.244.55.144/evaluation-service/logs
   ```

4. Start the development server:
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

3. Create a `.env` file with the following content:

   ```
   REACT_APP_API_BASE_URL=http://localhost:3000
   REACT_APP_LOGGING_API=http://20.244.55.144/evaluation-service/logs
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

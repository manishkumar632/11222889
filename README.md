# URL Shortener with Analytics

A full-stack URL shortener application with analytics and centralized logging capabilities. The application allows users to create shortened URLs with custom shortcodes and expiry times, and provides detailed analytics on URL visits.

## Screenshots

![URL Shortener Screenshot 1](<https://github.com/manishkumar632/images/blob/51dcf5d02f7d666f2099edf68576c18be60366ed/Screenshot%20(67).png>)

![URL Shortener Screenshot 2](<https://github.com/manishkumar632/images/blob/51dcf5d02f7d666f2099edf68576c18be60366ed/Screenshot%20(68).png>)

![URL Shortener Screenshot 3](https://github.com/manishkumar632/images/blob/51dcf5d02f7d666f2099edf68576c18be60366ed/Screenshot%20(69).png)

![URL Shortener Screenshot 4](https://github.com/manishkumar632/images/blob/51dcf5d02f7d666f2099edf68576c18be60366ed/Screenshot%20(66).png)


## Features

- **URL Shortening**: Generate short URLs with customizable shortcodes
- **URL Analytics**: Track and visualize URL visit statistics
- **Custom Expiry Times**: Set custom validity periods for URLs
- **Centralized Logging**: Shared logging middleware for both frontend and backend
- **Responsive UI**: Modern Material UI design that works on all devices

## Technology Stack

### Frontend

- React with TypeScript
- Material UI for component library
- Axios for API requests

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose

### Shared

- Custom logging-middleware package
- Centralized logging to evaluation server

## Project Structure

```
url-shortener/
├── backend/             # Express backend
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── middlewares/ # Express middlewares
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Utility functions
│   │   └── app.ts       # Main application file
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/            # React frontend
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service modules
│   │   ├── utils/       # Utility functions
│   │   └── App.tsx      # Main React component
│   ├── package.json
│   └── tsconfig.json
│
└── logging-middleware/  # Shared logging package
    ├── src/
    │   └── index.ts     # Logging implementation
    ├── package.json
    └── tsconfig.json
```

## API Endpoints

| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| POST   | /shorturl        | Create a new shortened URL         |
| GET    | /:code           | Redirect to the original URL       |
| GET    | /shorturls/:code | Get statistics for a shortened URL |
| GET    | /health          | Health check endpoint              |

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd url-shortener
```

2. Install dependencies for all packages:

```bash
# Install logging middleware dependencies
cd logging-middleware
npm install
npm run build

# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the backend directory with:
   ```
   PORT=3001
   MONGO_URI=mongodb://localhost:27017/urlshortener
   ```

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm start
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Usage

### Creating a Short URL

1. Enter the URL you want to shorten in the input field
2. Optionally, specify:
   - Validity period (in minutes)
   - Custom shortcode (4-12 alphanumeric characters)
3. Click "Shorten URL" to generate the shortened URL

### Viewing URL Statistics

1. Navigate to the Statistics page
2. View summary statistics for all URLs
3. Click on a specific URL to see detailed analytics:
   - Click count
   - Referrer information
   - Geographical data
   - Timestamp of visits

## Logging System

The application uses a centralized logging system that sends logs to an evaluation server. All logs include:

- Stack information (frontend or backend)
- Package name (component, controller, etc.)
- Log level (debug, info, warn, error, fatal)
- Timestamp
- Message


## Acknowledgments

- This project was developed as part of a campus hiring evaluation
- Thanks to the evaluation team for providing requirements and support

# Docker Setup for E-Water Gate Backend

This document explains how to run the E-Water Gate Backend application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Environment Variables

Before running the application, you need to set up the following environment variables. Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=4000

# Database Configuration
MONGODB_URL=mongodb://mongo:27017/e-water-gate

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXP=24h

# Email Configuration (Gmail)
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASS=your-gmail-app-password

# Firebase Configuration (optional - already configured in server.js)
FIREBASE_API_KEY=AIzaSyBOOsKN2TCl1nZMs9bMC0Y7rsfXwtTy0TQ
FIREBASE_AUTH_DOMAIN=e-wategate.firebaseapp.com
FIREBASE_DATABASE_URL=https://e-wategate-default-rtdb.asia-southeast1.firebasedatabase.app
FIREBASE_PROJECT_ID=e-wategate
FIREBASE_STORAGE_BUCKET=e-wategate.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=866686347436
FIREBASE_APP_ID=1:866686347436:web:7b019d20d8f4b9a1d7d709
FIREBASE_MEASUREMENT_ID=G-Q7E002TKV1
```

## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production Mode

To run the application in production mode:

```bash
docker-compose up --build
```

### Running in Background

To run the services in the background:

```bash
docker-compose up -d --build
```

## Accessing the Application

- **Backend API**: http://localhost:4000
- **MongoDB**: localhost:27017

## API Endpoints

The application exposes the following API endpoints under `/api/v1`:

- User routes: `/api/v1/user`
- Data routes: `/api/v1/data`
- Device routes: `/api/v1/device`

## Stopping the Application

To stop all services:

```bash
docker-compose down
```

To stop and remove volumes (this will delete the database data):

```bash
docker-compose down -v
```

## Building the Docker Image Only

If you want to build the Docker image without running it:

```bash
docker build -t e-water-gate-backend .
```

## Running the Container Only

If you want to run just the application container (without MongoDB):

```bash
docker run -p 4000:4000 --env-file .env e-water-gate-backend
```

## Troubleshooting

### Port Already in Use

If port 4000 is already in use, you can change it in the `docker-compose.yml` file:

```yaml
ports:
  - "4001:4000"  # Maps host port 4001 to container port 4000
```

### Database Connection Issues

Make sure the MongoDB service is running and the connection string is correct. The default connection string in the docker-compose file is:

```
mongodb://mongo:27017/e-water-gate
```

### Environment Variables

Ensure all required environment variables are set in your `.env` file. The application will fail to start if critical variables like `JWT_SECRET` or `MONGODB_URL` are missing.

## Development Workflow

1. Make changes to your code
2. In development mode, changes will be automatically reflected due to nodemon
3. In production mode, rebuild the image: `docker-compose build`
4. Restart the services: `docker-compose up -d` 
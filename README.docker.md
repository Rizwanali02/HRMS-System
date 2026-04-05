# Dockerizing the Backend

This directory includes a `Dockerfile` and a root-level `docker-compose.yml` to help you containerize and manage your backend application easily.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Dockerizing the Backend Only

To build the Docker image for the backend manually:

```bash
cd backend
docker build -t hrms-backend .
```

To run the container:

```bash
docker run -p 5000:5000 --env-file .env.production hrms-backend
```

### Using Docker Compose (Recommended)

To spin up the entire backend stack with all configuration:

From the **root directory**:

```bash
docker compose up --build
```

This will:
1. Build the backend image.
2. Read variables from your environment (or defaults in `docker-compose.yml`).
3. Start the container on port 5000.
4. Set up internal health checks.

### Environment Variables

The `docker-compose.yml` supports the following environment variables:
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Secret for JWT.
- `CLIENT_URL`: URL of your frontend application.
- `PORT`: Port to run the backend on (default 5000).

## Health Check

A health check endpoint has been added at `/api/health`. Docker uses this to monitor the status of your application. You can also visit it manually:

`GET http://localhost:5000/api/health`

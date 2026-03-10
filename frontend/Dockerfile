# Dockerfile - Frontend containerization
# This file defines the Docker image configuration for the frontend application
# Used to build and deploy the frontend in a containerized environment

FROM node:22-bullseye-slim
# Use a Vite-supported Node version (>=20.19). glibc-based image avoids esbuild crashes on musl.

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and a static server
RUN npm install --legacy-peer-deps \
 && npm install -g serve

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Serve the built app statically (stable in containers)
CMD ["serve", "-s", "dist", "-l", "3000"]

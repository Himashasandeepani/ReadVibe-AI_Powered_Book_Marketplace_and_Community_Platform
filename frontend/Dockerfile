# Dockerfile - Frontend containerization
# This file defines the Docker image configuration for the frontend application
# Used to build and deploy the frontend in a containerized environment

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start Vite dev server bound to all interfaces for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

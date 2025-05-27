# Development Dockerfile for User Service
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/user-service/package*.json ./apps/user-service/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/user-service ./apps/user-service
COPY libs ./libs

# Generate Prisma client
RUN cd apps/user-service && npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "run", "dev"]

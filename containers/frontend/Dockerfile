# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy all built files from builder stage
COPY --from=builder /app .

# Remove development dependencies
RUN npm install -g pnpm
RUN pnpm install --prod

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Set healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
CMD node -e "require('http').request('http://localhost:3000/api/health', { timeout: 2000 }, (res) => process.exit(res.statusCode !== 200)).on('error', () => process.exit(1)).end()"

# Start the application
CMD ["pnpm", "start"]
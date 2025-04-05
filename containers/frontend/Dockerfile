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

# Create directories for UI components
RUN mkdir -p src/components/ui src/lib

# Copy UI components if they exist
RUN if [ -d "components/ui" ]; then \
    cp -r components/ui/* src/components/ui/ || true; \
fi

# Create utils file if it doesn't exist
RUN if [ ! -f "src/lib/utils.ts" ]; then \
    echo 'import { clsx, type ClassValue } from "clsx";' > src/lib/utils.ts && \
    echo 'import { twMerge } from "tailwind-merge";' >> src/lib/utils.ts && \
    echo '' >> src/lib/utils.ts && \
    echo 'export function cn(...inputs: ClassValue[]) {' >> src/lib/utils.ts && \
    echo '  return twMerge(clsx(inputs));' >> src/lib/utils.ts && \
    echo '}' >> src/lib/utils.ts; \
fi

# Fix lucide-react imports
RUN if [ -f "app/consumer/page.tsx" ]; then \
    sed -i 's/Exchange/ArrowLeftRight/g' app/consumer/page.tsx; \
fi

# Update tsconfig.json if it exists
RUN if [ -f "tsconfig.json" ]; then \
    grep -q '"@/*": "./*"' tsconfig.json || \
    sed -i 's/"@\/*": ".\/src\/*"/"@\/*": ".\/src\/*",\n    "@\/*": ".\/*"/' tsconfig.json; \
fi

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
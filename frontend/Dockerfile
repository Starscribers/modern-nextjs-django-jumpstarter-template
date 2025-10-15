# Frontend Dockerfile for example_project

# Stage 1: Dependencies
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies without running scripts and dev dependencies
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Stage 2: Builder
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_API_URL

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies) without running scripts
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20-bookworm-slim AS runner
WORKDIR /app

# Accept build arguments for runtime environment
ARG NEXT_PUBLIC_API_URL

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Create non-root user
RUN groupadd -r example_project && useradd -r -g example_project -d /app -s /usr/sbin/nologin example_project

# Copy production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/src ./src

# Create directories and set permissions
RUN mkdir -p .next/cache && \
    chown -R example_project:example_project /app

# Switch to non-root user
USER example_project

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

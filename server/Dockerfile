# Build stage
FROM node:24.15.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:24.15.0-alpine AS runner

WORKDIR /app

# Install dumb-init to correctly handle UNIX signals (SIGTERM, SIGINT) as PID 1
RUN apk add --no-cache dumb-init

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

# Create a non-root group and user for security best practices (least privilege)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to the non-root user
USER nodejs

EXPOSE 5000

ENV NODE_ENV=production

# Health check to monitor application runtime status
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

# Entrypoint using dumb-init to avoid zombie processes and forward signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run the compiled backend server.js file
CMD ["node", "dist/server.js"]
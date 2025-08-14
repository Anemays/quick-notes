# ---------- dependencies stage ----------
FROM node:20-alpine AS deps

# Update npm to latest version
RUN npm install -g npm@latest

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for better caching
RUN npm ci --only=production && npm cache clean --force

# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code (excluding node_modules via .dockerignore)
COPY . .

# Build the application
RUN npm run build

# ---------- runtime stage ----------
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built application from build stage
COPY --from=build /app/dist .

# Copy nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Create directories and set correct permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

EXPOSE 80

ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]

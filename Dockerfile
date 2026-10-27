# Stage 1: build the static site.
# Run `npm run sync-release` (and `npm run assets`) on the host first: the DMG mirror and
# src/data/release.json are gitignored, so they only reach the image from the build context.
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV ASTRO_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: serve with nginx.
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/health || exit 1

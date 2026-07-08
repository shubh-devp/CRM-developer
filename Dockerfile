FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 express

COPY --from=frontend-builder --chown=express:nodejs /app/frontend/out ./frontend/out
COPY --from=backend-builder --chown=express:nodejs /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=express:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder --chown=express:nodejs /app/backend/package.json ./backend/

COPY package.json server.js ./

RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

RUN mkdir -p /app/logs && chown -R express:nodejs /app/logs

USER express

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

CMD ["node", "server.js"]

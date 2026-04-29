FROM node:22-alpine

# Potrzebne do kompilacji better-sqlite3 (na alpine bez prebuilt binary dla każdej arch)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Najpierw zależności (cache layer)
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production && npm cache clean --force

# Reszta plików
WORKDIR /app
COPY server/ ./server/
COPY public/ ./public/

ENV NODE_ENV=production
ENV PORT=8080
ENV DATA_DIR=/data

EXPOSE 8080

WORKDIR /app/server
CMD ["node", "index.js"]

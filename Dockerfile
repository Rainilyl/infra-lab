FROM node:20-alpine AS builder

WORKDIR /app
COPY client/package.json client/package-lock.json* ./client/
RUN cd client && npm ci --silent

COPY client/ ./client/
RUN cd client && npm run build

FROM node:20-alpine

WORKDIR /app
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm ci --silent --omit=dev

COPY server/ ./server/
COPY --from=builder /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server/app.js"]

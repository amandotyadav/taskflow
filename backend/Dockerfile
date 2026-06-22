# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# Production stage
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
RUN addgroup -S nodejs && adduser -S taskflow -G nodejs
USER taskflow
EXPOSE 5000
CMD ["npm","start"]
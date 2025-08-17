# ====== Frontend build stage =====
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ====== Production build =====
FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Copy frontend build output from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

RUN go build -o main .

# ====== Minimal final image =====
FROM alpine:latest AS prod

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080

CMD ["./main"]

# Build stage
FROM node:18-bullseye AS builder
WORKDIR /app

# Install build tools for canvas
RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

# Copy dependency files and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build
COPY . .
RUN npm run build

# Final runtime container
FROM node:18-slim
WORKDIR /app

# Install runtime dependencies for canvas
RUN apt-get update && apt-get install -y \
  libcairo2 \
  libpango-1.0-0 \
  libjpeg62-turbo \
  libgif7 \
  librsvg2-2 \
  && rm -rf /var/lib/apt/lists/*

# Copy build output and node_modules from builder stage
COPY --from=builder /app ./

EXPOSE 8080
ENV PORT 8080
CMD ["npm", "start"]

FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy root workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy backend package.json
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy backend source code
COPY apps/backend ./apps/backend

# Expose port
EXPOSE 3000

# Start development server with hot reload
CMD ["pnpm", "--filter", "backend", "start:dev"]

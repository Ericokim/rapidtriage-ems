# Container image for the RapidTriage API (Railway / Fly.io / any Docker host).
# Builds the shared package + API from the monorepo, then runs the server.
# The server applies pending DB migrations on boot.
FROM node:20-slim
WORKDIR /app

# Copy the full monorepo, then install only the API + shared workspaces.
COPY . .
RUN npm ci --include-workspace-root -w @rapidtriage/api -w @rapidtriage/shared \
  || npm ci
RUN npm run build:shared && npm --workspace @rapidtriage/api run build

ENV NODE_ENV=production
EXPOSE 4000
WORKDIR /app/apps/api
CMD ["node", "dist/server.js"]

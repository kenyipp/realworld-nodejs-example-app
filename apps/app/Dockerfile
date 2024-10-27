#
# Base image for the server
#
FROM node:18 AS base

ARG WORKSPACE_SCOPE=@conduit/app

# Set working directory
WORKDIR /app
RUN yarn global add turbo

# Copy the project files
COPY . .

# Use the build argument in the turbo prune command
RUN turbo prune --scope=$WORKSPACE_SCOPE --docker

#
# Installer image
# Add lockfile and package.json's of isolated sub-workspace
#
FROM base AS installer

# Set working directory
WORKDIR /app

# Copy necessary files to the installer stage
COPY .gitignore .gitignore
COPY --from=base /app/out/json/ .
COPY --from=base /app/out/yarn.lock ./yarn.lock

# Install dependencies
RUN yarn install

# Build the project using the variable scope
COPY --from=base /app/out/full/ .
RUN turbo run build --filter=$WORKSPACE_SCOPE...

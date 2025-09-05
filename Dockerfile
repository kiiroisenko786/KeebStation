# Multi-stage Dockerfile for KeebStation
# Stage 1: Build React Client
FROM node:20.18.0-alpine3.20 AS client-build

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy client source
COPY client/ ./

# Build the React app (outputs to ../API/wwwroot)
RUN npm run build

# Stage 2: Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine AS api-build

WORKDIR /app

# Copy csproj and restore dependencies
COPY API/API.csproj API/
RUN dotnet restore API/API.csproj

# Copy API source
COPY API/ API/

# Copy built client files from previous stage
COPY --from=client-build /app/API/wwwroot API/wwwroot

# Build and publish the API
RUN dotnet publish API/API.csproj -c Release -o out

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime

# Create a non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

# Copy the published API
COPY --from=api-build /app/out .

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Set environment variables for production
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:8080

# Run the application
ENTRYPOINT ["dotnet", "API.dll"]

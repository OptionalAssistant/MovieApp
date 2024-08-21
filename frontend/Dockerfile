# Stage 1: Build the React application
FROM node:18 AS build

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .
ENV GENERATE_SOURCEMAP=false
# Build the application
RUN npm run build

# Stage 2: Serve the application using a lightweight HTTP server
FROM node:18 AS production

# Install http-server globally
RUN npm install -g http-server

# Set the working directory
WORKDIR /usr/src/app

# Copy the build folder from the build stage
COPY --from=build /usr/src/app/build ./build

# Expose port 8080
EXPOSE 8080

# Start the HTTP server
CMD ["http-server", "build", "-p", "8080"]
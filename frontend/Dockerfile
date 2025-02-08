# frontend/Dockerfile

# Stage 1: Build the React application
# We use node:16 as our base image for building the application
FROM node:16-alpine as builder

# Set the working directory in the container
# This is where our application code will live during the build process
WORKDIR /app

# Copy package files
# We copy these first to leverage Docker's caching mechanism
# If these files don't change, npm install won't run again
COPY package.json package-lock.json* ./

# Install dependencies
# We use npm ci instead of npm install for more reliable builds
# It's faster and ensures we get exactly what's in package-lock.json
RUN npm ci

# Copy the rest of the application code
# This includes all our React components, assets, and configuration
COPY . .

# Build the application
# This creates an optimized production build in the /app/build directory
RUN DISABLE_ESLINT_PLUGIN=true npm run build

# Stage 2: Serve the application
# We use nginx:alpine as it's lightweight and good for serving static content
FROM nginx:alpine

# Copy the nginx configuration template
# This config file will help us serve our React application properly
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

# Copy the built application from the previous stage
# We only copy the built files, not the entire source code
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 3000 to match our nginx configuration
EXPOSE 3000

# Start nginx in the foreground
# This ensures the container stays running
CMD ["nginx", "-g", "daemon off;"]
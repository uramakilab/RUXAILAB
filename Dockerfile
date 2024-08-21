FROM node:lts AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Run build as per the script defined in package.json
RUN npm run build-dev

# Production stage using a minimal Node.js image
FROM node:alpine AS production-stage

# Install 'serve' to serve the application
RUN npm install -g serve

WORKDIR /app

# Copy the built application from the build stage
COPY --from=build-stage /app/dist /app

# Expose the port that 'serve' will run on
EXPOSE 5000

# Command to serve the application on port 5000
CMD ["serve", "-s", ".", "-l", "5000"]

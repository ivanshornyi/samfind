FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps


# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# 🏗 Production Stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Expose the required port
EXPOSE 4000

# Start the server
CMD ["npm", "run", "start"]

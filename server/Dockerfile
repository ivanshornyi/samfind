FROM --platform=$TARGETPLATFORM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the project
RUN npm run build

FROM --platform=$TARGETPLATFORM node:20-alpine AS production
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "dist/main.js"]
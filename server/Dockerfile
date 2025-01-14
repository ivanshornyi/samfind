# FROM node:20
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --production
# COPY . .
# RUN npm run build
# EXPOSE 4000
# ARG NODE_ENV=production
# ENV NODE_ENV=$NODE_ENV
# COPY .env .env
# CMD ["npm", "run", "start:prod"]
# Use Node.js 20.11.1 base image
FROM node:20.11.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD [  "npm", "run", "start:migrate:prod" ]

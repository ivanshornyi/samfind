FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
COPY .env .env
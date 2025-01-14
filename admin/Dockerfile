FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "dev", "--", "--host"]
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
COPY .env .env

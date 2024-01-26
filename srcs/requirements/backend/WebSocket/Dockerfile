FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install ws

COPY . .

EXPOSE 90

CMD ["node", "server.js"]



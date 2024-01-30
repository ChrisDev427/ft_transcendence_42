FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install ws

RUN npm install uuid

COPY . .

EXPOSE 90

CMD ["node", "server.js"]



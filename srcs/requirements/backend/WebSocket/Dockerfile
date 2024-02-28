FROM node:14

WORKDIR /app

RUN npm install ws

RUN npm install uuid

RUN npm install node-fetch@2

COPY . .

EXPOSE 90

CMD ["node", "server.js"]



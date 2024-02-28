FROM node:14

WORKDIR /app

RUN npm install ws

RUN npm install uuid

RUN npm install node-fetch@2

COPY . .

# RUN cp package.json /app/node_modules/node-fetch/package.json

EXPOSE 90

CMD ["node", "server.js"]



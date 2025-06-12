FROM node:22.1.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3001

RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]

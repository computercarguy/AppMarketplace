# syntax=docker/dockerfile:1

FROM node:21-alpine as development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build


FROM node:21-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist ./

USER node

EXPOSE 3002

CMD node server.js

# syntax=docker/dockerfile:1

FROM node:latest

ENV NODE_ENV production

WORKDIR /usr/src/app
RUN npm install -g ts-node typescript

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

USER node

COPY . .

EXPOSE 3002

CMD ts-node server.ts

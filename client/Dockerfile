FROM node:21-alpine

LABEL version="1.0"
LABEL description="This is the base docker image for the App Marketplace frontend react app."
LABEL maintainer = ["sales@ericsgear.com", "sales@ericsgear.com"]

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

EXPOSE 3000

CMD npm start
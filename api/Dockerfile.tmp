FROM node:latest

LABEL version="1.0"
LABEL description="This is the base docker image for the App Marketplace API."
LABEL maintainer = ["sales@ericsgear.com", "sales@ericsgear.com"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --omit=dev

COPY . .

EXPOSE 3002

CMD ["ts-node", "server.ts"]
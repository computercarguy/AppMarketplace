FROM node:latest as build-stage

ENV APIPORT=3002

RUN npm install -g ts-node typescript

WORKDIR /appmarketplace
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE ${APIPORT}
CMD ["npm", "start"]


FROM nginx:latest as prod-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
const swaggerAutogen = require('swagger-autogen')();
const env = process.env.NODE_ENV;
const host = env && env.trim() === "development" ? 'localhost:8080' : "appmarketplace.ericsgear.com";

const doc = {
  info: {
    title: "Eric's Gear Marketplace API",
    description: ''
  },
  host: host,
  schemes: ['http','https'],
  securityDefinitions: {
    Bearer:
    {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description: 'Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345".'
    }
  },
  security: [
    {
      bearerAuth: [],
    },
  ]
};

const outputFile = './swagger-output.json';
const routes = [`${__dirname}/routes/*.ts`];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
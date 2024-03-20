const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "Eric's Gear Marketplace API",
    description: ''
  },
  host: 'localhost:3002',
  schemes: ['http','https']
};

const outputFile = './swagger-output.json';
const routes = [`${__dirname}/routes/*.ts`];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
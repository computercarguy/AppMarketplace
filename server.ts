require('./config/env');

import "reflect-metadata";
import express from "express";
import cors from 'cors';
import { UtilitiesRouter } from './src/api/routes/utilitiesRouter';
import { UtilitiesCreditsRouter } from "./src/api/routes/utilitiesCreditsRouter";
import { StripeRouter } from "./src/api/routes/stripeRouter";
import { InvoiceRouter } from "./src/api/routes/invoiceRouter";
import { AuthenticateRouter } from "./src/api/routes/authenticateRouter";
import { UserRouter } from "./src/api/routes/userRouter";
import swaggerUi = require('swagger-ui-express');
import swaggerDocument = require('./src/api/swagger-output.json');
import { PaymentMethodImagesRouter } from "./src/api/routes/paymentmethodimagesRouter";
import { HealthRouter } from "./src/api/routes/healthRouter";

const port = 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
});

app.use(new UtilitiesCreditsRouter().setupRouter());
app.use(new UtilitiesRouter().setupRouter());
app.use(new StripeRouter().setupRouter());
app.use(new InvoiceRouter().setupRouter());
app.use(new AuthenticateRouter().setupRouter());
app.use(new UserRouter().setupRouter());
app.use(new PaymentMethodImagesRouter().setupRouter());
app.use(new HealthRouter().setupRouter());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static(__dirname  + '/build'));

app.listen(port, () => {
    console.log(`Server running. Port: ${port}`);
});

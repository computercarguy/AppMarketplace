require('./config/env');

import "reflect-metadata";
import * as express from "express";
import * as cors from 'cors';
import { UtilitiesRouter } from './routes/utilitiesRouter';
import { UtilitiesCreditsRouter } from "./routes/utilitiesCreditsRouter";
import { StripeRouter } from "./routes/stripeRouter";
import { InvoiceRouter } from "./routes/invoiceRouter";
import { AuthenticateRouter } from "./routes/authenticateRouter";
import { UserRouter } from "./routes/userRouter";
import swaggerUi = require('swagger-ui-express');
import swaggerDocument = require('./swagger-output.json');

const port = 3002;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(new UtilitiesCreditsRouter().setupRouter());
app.use(new UtilitiesRouter().setupRouter());
app.use(new StripeRouter().setupRouter());
app.use(new InvoiceRouter().setupRouter());
app.use(new AuthenticateRouter().setupRouter());
app.use(new UserRouter().setupRouter());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
});

app.listen(port, () => {
    console.log(`Server running. Port: ${port}`);
});

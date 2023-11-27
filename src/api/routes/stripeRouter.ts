import { Router } from 'express';
import { StripePayments } from '../repos/stripePayments';
import Container from "typedi";

export class StripeRouter {
    setupRouter(): Router {
        let stripePayments = Container.get(StripePayments);
        let stripeRouter = Router();
        
        stripeRouter.post('/stripe/createPaymentIntent', stripePayments.createPaymentIntent);
        stripeRouter.post('/stripe/paymentProcessed', stripePayments.paymentProcessed);
        stripeRouter.get('/stripe/paymentMethods', stripePayments.getPaymentMethods);
        stripeRouter.put('/stripe/updatePaymentIntent', stripePayments.updatePaymentIntent);
        stripeRouter.post("/webhook", stripePayments.webhook);
        return stripeRouter;
    }
}
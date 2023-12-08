import { Router } from 'express';
import { StripePayments } from '../repos/stripePayments';
import Container from "typedi";

export class StripeRouter {
    setupRouter(): Router {
        let stripePayments = Container.get(StripePayments);
        let router = Router();
        
        router.post('/stripe/createPaymentIntent', stripePayments.createPaymentIntent);
        router.post('/stripe/paymentProcessed', stripePayments.paymentProcessed);
        router.get('/stripe/paymentMethods', stripePayments.getPaymentMethods);
        router.put('/stripe/updatePaymentIntent', stripePayments.updatePaymentIntent);
        router.post("/webhook", stripePayments.webhook);
        
        return router;
    }
}
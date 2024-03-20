import { Router } from 'express';
import { StripePayments } from '../repos/stripePayments';
import Container from "typedi";

export class StripeRouter {
    setupRouter(): Router {
        let stripePayments = Container.get(StripePayments);
        let router = Router();
        
        router.get('/stripe/key', (req, res) => stripePayments.getKey(req, res));
        router.post('/stripe/createPaymentIntent', (req, res) => stripePayments.createPaymentIntent(req, res));
        router.post('/stripe/paymentProcessed', (req, res) => stripePayments.paymentProcessed(req, res));
        router.get('/stripe/paymentMethods', (req, res) => stripePayments.getPaymentMethods(req, res));
        router.put('/stripe/updatePaymentIntent', (req, res) => stripePayments.updatePaymentIntent(req, res));
        router.post("/webhook", (req, res) => stripePayments.webhook(req, res));
        
        return router;
    }
}
import { Router } from 'express';
import Container from "typedi";
import { PaymentMethodImages } from '../repos/paymentmethodimages';

export class PaymentMethodImagesRouter {
    setupRouter(): Router {
        let paymentMethodImages = Container.get(PaymentMethodImages);
        let router = Router();
        
        router.get('/paymentmethodimages/', (req, res) => paymentMethodImages.getPaymentMethodImages(req, res));
        
        return router;
    }
}
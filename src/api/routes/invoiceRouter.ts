import { Router } from 'express';
import Container from "typedi";
import { Invoices } from '../repos/invoices';

export class InvoiceRouter {
    setupRouter(): Router {
        let invoices = Container.get(Invoices);
        let router = Router();
        
        router.get('/stripe/invoices', invoices.getInvoices);
        
        return router;
    }
}
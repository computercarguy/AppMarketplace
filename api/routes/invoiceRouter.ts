import { Router } from 'express';
import Container from "typedi";
import { Invoices } from '../repos/invoices';

export class InvoiceRouter {
    setupRouter(): Router {
        let invoices = Container.get(Invoices);
        let router = Router();
        
        router.get('/invoices', (req, res) => invoices.getInvoices(req, res));
        router.get('/invoice/items/:ids', (req, res) => invoices.getInvoiceItems(req, res));
        
        return router;
    }
}
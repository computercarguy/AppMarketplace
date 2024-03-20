import { Request, Response } from "express-serve-static-core";
import { Container, Service } from "typedi";
import useSendResponse from "../hooks/useSendResponse";
import { Authentication } from "./authentication";
import { ApiResponse } from "../models/ApiResponse";
import * as settings from '../Settings.json';
import { InvoicesDb } from "../db/invoicesDb";
import { InvoiceItemsDb } from "../db/invoiceItemsDb";

@Service()
export class Invoices {
    getInvoices(req: Request, res: Response) {
        let auth = Container.get(Authentication);
        let invoicesDb = Container.get(InvoicesDb);
        let invoiceIds = req.body.ids;

        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }

            invoicesDb.getInvoices(userId, invoiceIds, (response: ApiResponse) => 
                useSendResponse(
                    res,
                    response.results,
                    response == null ? settings.errorMessage : null
                ));
        });
    }

    getInvoiceItems(req: Request, res: Response) {
        let auth = Container.get(Authentication);
        let invoiceItemsDb = Container.get(InvoiceItemsDb);
        let invoiceIds = req.params.ids;

        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }

            invoiceItemsDb.getInvoiceItems(invoiceIds, (response: ApiResponse) => 
                useSendResponse(
                    res,
                    response.results,
                    response == null ? settings.errorMessage : null
                ));
        });
    }
};

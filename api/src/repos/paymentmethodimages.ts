import { Request, Response } from "express-serve-static-core";
import { Container, Service } from "typedi";
import useSendResponse from "../hooks/useSendResponse";
import { Authentication } from "./authentication";
import { ApiResponse } from "../models/ApiResponse";
import * as settings from '../Settings.json';
import { PaymentMethodImagesDb } from "../db/paymentMethodImagesDb";

@Service()
export class PaymentMethodImages {
    getPaymentMethodImages(req: Request, res: Response) {
        let auth = Container.get(Authentication);
        let paymentMethodImagesDb = Container.get(PaymentMethodImagesDb);

        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }

            paymentMethodImagesDb.getPaymentMethodImages(req.body.id, (response: ApiResponse) => 
                useSendResponse(
                    res,
                    response.results,
                    response == null ? settings.errorMessage : null
                ));
        });
    }
};

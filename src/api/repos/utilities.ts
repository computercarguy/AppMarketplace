import { Request, Response } from "express-serve-static-core";
import { UtilitiesDb } from "../db/utilitiesDb";
import { Container, Service } from "typedi";
import useSendResponse from "../hooks/useSendResponse";
import { Authentication } from "./authentication";
import { ApiResponse } from "../models/ApiResponse";
import * as settings from '../../Settings.json';

@Service()
export class Utilities {
    getUtility(req: Request, res: Response) {
        let auth = Container.get(Authentication);
        let utilitiesDb = Container.get(UtilitiesDb);

        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }
            
            utilitiesDb.getUtilities((response: ApiResponse) => 
                useSendResponse(
                    res,
                    response.results,
                    response == null ? settings.errorMessage : null
                ));
        });
    }
};

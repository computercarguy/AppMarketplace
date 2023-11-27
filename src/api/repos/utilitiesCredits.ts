import { Request, Response } from "express-serve-static-core";
import { UtilitiesCreditsDb } from "../db/utilitiesCreditsDb";
import useSendResponse from "../hooks/useSendResponse";
import { UtilitiesCreditsData } from "../models/UtilitiesCreditsData";
import { Authentication } from "./authentication";
import { UserData } from "../models/UserData";
import { Container, Service } from "typedi";
import { ApiResponse } from "../models/ApiResponse";
import * as settings from '../../Settings.json';

let utilitiesCreditsDb = Container.get(UtilitiesCreditsDb);
let auth = Container.get(Authentication);

@Service()
export class UtilitiesCredits {
    getCredits(req: Request, res: Response) {
        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }
            
            let data: UserData = {OAuthUserId: userId, UtilitiesId: null};
            
            utilitiesCreditsDb.getUtilitiesCredits(data, (response: ApiResponse) => 
                useSendResponse(
                    res,
                    response.results,
                    response == null ? settings.errorMessage : null
                ));
        });
    }
    
    update(req: Request, res: Response) {
        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }

            utilitiesCreditsDb.upsert(req.body as UtilitiesCreditsData, (response: UtilitiesCreditsData) => 
            
            useSendResponse(
                res,
                response,
                response == null ? settings.errorMessage : null
            ));
        });
    }
};

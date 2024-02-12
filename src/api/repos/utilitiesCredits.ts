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
        let utilitiesGuid: string = req.query.utilitiesGuid.toString();

        if (!utilitiesGuid) {
            useSendResponse(res);
            return;
        }

        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }
            
            let data: UserData = {OAuthUserId: userId, UtilitiesId: null, UtilitiesGuid: utilitiesGuid};

            utilitiesCreditsDb.getUtilitiesCredits(data, (response: ApiResponse) => 
                useSendResponse(
                    res,
                    response.results,
                    response == null ? settings.errorMessage : null
                ));
        });
    }
    
    update(req: Request, res: Response) {
        let data = req.body as UtilitiesCreditsData;

        if (!data.UtilitiesGuid || !data.QuantityUsed) {
            useSendResponse(res);
            return;
        }

        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }
            
            data.OAuthUserId = userId;

            utilitiesCreditsDb.getUtilitiesCredits(data, (response: ApiResponse) => 
            {
                if (!response || !response.results || response.results.length !== 1) {
                    useSendResponse(res);
                    return;
                }

                let utilityRecord = response.results[0] as UtilitiesCreditsData;

                if (data.UtilitiesId && utilityRecord.Id != data.UtilitiesId) {
                    useSendResponse(res);
                    return;
                }

                data.UtilitiesId = null;

                if (utilityRecord.Available < data.QuantityUsed) {
                    useSendResponse(res);
                    return;
                }

                utilitiesCreditsDb.upsert(data, (upsertResponse: ApiResponse) => 
                {
                    if (upsertResponse.results["affectedRows"] == 1) {
                        useSendResponse(
                            res,
                            "complete",
                            upsertResponse == null ? settings.errorMessage : null
                        );

                        return;
                    }
                    else {
                        useSendResponse(res);
                        return;
                    }
                });
            });
        });
    }
};

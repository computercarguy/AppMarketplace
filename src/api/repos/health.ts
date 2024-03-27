import { Container, Service } from 'typedi';
import { Request, Response } from "express-serve-static-core";
import useSendResponse from "../hooks/useSendResponse";
import { DbWrapper } from '../db/dbWrapper';
import { ApiResponse } from '../models/ApiResponse';

@Service()
export class Health {
    private dbWrapper = Container.get(DbWrapper);

    async getHealth(req: Request, res: Response) {
        this.dbWrapper.healthCheck((response: ApiResponse) => {
            if (response.error) {
                this.dbWrapper.savelog("health.ts", "getHealth", "healthCheck", null, JSON.stringify(response.error));
                return;
            }

            useSendResponse(res, "App Mrketplace is running.", null);
        });
    }
}
import { Container, Service } from 'typedi';
import { Request, Response } from "express-serve-static-core";
import useSendResponse from "../hooks/useSendResponse";
import { DbWrapper } from '../db/dbWrapper';
import { ApiResponse } from '../models/ApiResponse';
import useSecrets from "../hooks/useSecrets";

@Service()
export class Health {
    private dbWrapper = Container.get(DbWrapper);

    async getHealth(req: Request, res: Response) {
        this.dbWrapper.healthCheck(async (response: ApiResponse) => {
            const hosttype = process.env.hostType;
            const secret = await useSecrets();
            const errors:string[] = [];

            if (!secret) {
                errors.push("Failed to get secret.");
            }

            if (response.error) {
                errors.push(JSON.stringify(response.error));
            }

            useSendResponse(res, `App Marketplace is running. ${hosttype.toUpperCase()}`, errors.join(",\r\n"));
        });
    }
}
import { Service } from 'typedi';
import { Request, Response } from "express-serve-static-core";
import useSendResponse from "../hooks/useSendResponse";

@Service()
export class Health {
    async getHealth(req: Request, res: Response) {
        useSendResponse(res, "running", null);
    }
}
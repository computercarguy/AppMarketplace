import { Request, Response } from "express-serve-static-core";
import { Container, Service } from "typedi";
import { Authentication } from "./authentication";
import useSendResponse from "../hooks/useSendResponse";
import { ApiResponse } from "../models/ApiResponse";

const auth = Container.get(Authentication);

@Service()
export class Authenticate {
    login(req: Request, res: Response) {
        auth.login(req, (response) => {
            if (typeof response === "object") {
                useSendResponse(
                    res,
                    response,
                    null
                );
            } else {
                useSendResponse(
                    res,
                    null,
                    null
                );
            }
        });
    }

    logout(req: Request, res: Response) {
        auth.logout(req, req.body.logoutType, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    registerUser(req: Request, res: Response) {
        auth.registerUser(req, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    validateUser(req: Request, res: Response) {
        auth.validateUser(req, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    getUserId(req: Request, res: Response) {
        auth.getUserId(req, (userId: number) => {
            useSendResponse(
                res,
                userId.toString(),
                null
            );
        });
    }

    getPasswordComplexity(req: Request, res: Response) {
        auth.getPasswordComplexity(req, (passwordcomplexity: ApiResponse) => {
            useSendResponse(
                res,
                passwordcomplexity.message,
                null
            );
        });
    }
}
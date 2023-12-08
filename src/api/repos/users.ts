import { Request, Response } from "express-serve-static-core";
import { Service } from "typedi";
import useSendResponse from "../hooks/useSendResponse";
import { ApiResponse } from "../models/ApiResponse";
import useGetBearerToken from "../hooks/useGetBearerToken";
import * as settings from '../../Settings.json';
import useFetch from "../hooks/useFetch";

@Service()
export class Users {
    update(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.user.updateUser;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    updatePassword(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.user.updatePassword;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    disable(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.user.disableUser;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    createPasswordReset(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.user.createPasswordReset;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    doPasswordReset(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.user.doPasswordReset;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    forgotUsername(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.user.forgotUsername;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    getUser(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.user.getUser;

        useFetch(url, "get", token, null, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }
}
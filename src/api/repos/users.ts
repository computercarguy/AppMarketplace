import { Request, Response } from "express-serve-static-core";
import { Service } from "typedi";
import useSendResponse from "../hooks/useSendResponse";
import { ApiResponse } from "../models/ApiResponse";
import useGetBearerToken from "../hooks/useGetBearerToken";
import * as settings from '../../Settings.json';
import useFetch from "../hooks/useFetch";
import useAwsSecrets from "../hooks/useAwsSecrets";

@Service()
export class Users {
    private loginUrl: String = null;

    async update(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.updateUser;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    async updatePassword(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.updatePassword;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    async disable(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.disableUser;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    async createPasswordReset(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.createPasswordReset;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    async doPasswordReset(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.doPasswordReset;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    async forgotUsername(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.forgotUsername;

        useFetch(url, "post", token, req.body, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    async getUser(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.getUser;

        useFetch(url, "get", token, null, (response: ApiResponse) => {
            useSendResponse(
                res,
                response.message,
                response.error
            );
        });
    }

    async getOAuthUser(req: Request) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.getUser;
        let response = await useFetch(url, "get", token, null, null);

        return response.message;
    }

    
    private async getLoginUrl() {
        if (this.loginUrl === null) {
            let secrets = await useAwsSecrets(null);
            this.loginUrl = secrets.login;
        }

        return this.loginUrl;
    }
}
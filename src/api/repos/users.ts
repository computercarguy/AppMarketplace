import { Request, Response } from "express-serve-static-core";
import { Container, Service } from "typedi";
import useSendResponse from "../hooks/useSendResponse";
import { ApiResponse } from "../models/ApiResponse";
import useGetBearerToken from "../hooks/useGetBearerToken";
import * as settings from '../../Settings.json';
import useFetch from "../hooks/useFetch";
import useAwsSecrets from "../hooks/useAwsSecrets";
import { EventLogDb } from "../db/eventLogDb";

@Service()
export class Users {
    private loginUrl: String = null;
    private eventLogDb = Container.get(EventLogDb);

    async update(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.updateUser;

        useFetch(url, "post", token, JSON.stringify(req.body), (response: ApiResponse) => {
            if (response.error){
                this.eventLogDb.savelog("users.ts", "update", "useFetch", null, this.eventLogDb.concatErrorMessage(response.error, req.body));
            }

            useSendResponse(
                res,
                response.message,
                response.error
            );
        }, "application/json; charset=utf-8");
    }

    async updatePassword(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.updatePassword;

        useFetch(url, "post", token, JSON.stringify(req.body), (response: ApiResponse) => {
            if (response.error){
                this.eventLogDb.savelog("users.ts", "updatePassword", "useFetch", null, this.eventLogDb.concatErrorMessage(response.error, req.body));
            }

            useSendResponse(
                res,
                response.message,
                response.error
            );
        }, "application/json; charset=utf-8");
    }

    async disable(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.disableUser;

        useFetch(url, "post", token, JSON.stringify(req.body), (response: ApiResponse) => {
            if (response.error){
                this.eventLogDb.savelog("users.ts", "disable", "useFetch", null, this.eventLogDb.concatErrorMessage(response.error, req.body));
            }

            useSendResponse(
                res,
                response.message,
                response.error
            );
        }, "application/json; charset=utf-8");
    }

    async createPasswordReset(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.createPasswordReset;

        useFetch(url, "post", token, JSON.stringify(req.body), (response: ApiResponse) => {
            if (response.error){
                this.eventLogDb.savelog("users.ts", "createPasswordReset", "useFetch", null, this.eventLogDb.concatErrorMessage(response.error, req.body));
            }

            useSendResponse(
                res,
                response.message,
                response.error
            );
        }, "application/json; charset=utf-8");
    }

    async doPasswordReset(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.doPasswordReset;

        useFetch(url, "post", token, JSON.stringify(req.body), (response: ApiResponse) => {
            if (response.error){
                this.eventLogDb.savelog("users.ts", "doPasswordReset", "useFetch", null, this.eventLogDb.concatErrorMessage(response.error, req.body));
            }

            useSendResponse(
                res,
                response.message,
                response.error
            );
        }, "application/json; charset=utf-8");
    }

    async forgotUsername(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.forgotUsername;

        useFetch(url, "post", token, JSON.stringify(req.body), (response: ApiResponse) => {
            if (response.error){
                this.eventLogDb.savelog("users.ts", "forgotUsername", "useFetch", null, this.eventLogDb.concatErrorMessage(response.error, req.body));
            }

            useSendResponse(
                res,
                response.message,
                response.error
            );
        }, "application/json; charset=utf-8");
    }

    async getUser(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.getUser;

        useFetch(url, "get", token, null, (response: ApiResponse) => {
            if (response.error){
                this.eventLogDb.savelog("users.ts", "getUser", "useFetch", null, this.eventLogDb.concatErrorMessage(response.error, req.body));
            }

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
            let secrets = await useAwsSecrets(this.eventLogDb.savelog, null);
            this.loginUrl = secrets.login;
        }

        return this.loginUrl;
    }
}
import { Request, Response } from "express-serve-static-core";
import { Container, Service } from "typedi";
import useSendResponse from "../hooks/useSendResponse";
import { ApiResponse } from "../models/ApiResponse";
import useGetBearerToken from "../hooks/useGetBearerToken";
import * as settings from '../../Settings.json';
import useFetch from "../hooks/useFetch";
import useSecrets from "../hooks/useSecrets";
import { EventLog } from "./eventLog";

@Service()
export class Users {
    private loginUrl: String = null;
    private eventLog = Container.get(EventLog);

    async update(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.updateUser;

        useFetch(url, "post", token, JSON.stringify(req.body), (response: ApiResponse) => {
            if (response.error){
                this.eventLog.savelog("users.ts", "update", "useFetch", null, this.eventLog.concatErrorMessage(response.error, req.body));
            }

            useSendResponse(
                res,
                response.message,
                response.error,
                response.status
            );
        }, "application/json; charset=utf-8");
    }

    async updatePassword(req: Request, res: Response) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.updatePassword;

        useFetch(url, "post", token, JSON.stringify(req.body), (response: ApiResponse) => {
            if (response.error){
                this.eventLog.savelog("users.ts", "updatePassword", "useFetch", null, this.eventLog.concatErrorMessage(response.error, req.body));
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
                this.eventLog.savelog("users.ts", "disable", "useFetch", null, this.eventLog.concatErrorMessage(response.error, req.body));
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
                this.eventLog.savelog("users.ts", "createPasswordReset", "useFetch", null, this.eventLog.concatErrorMessage(response.error, req.body));
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
                this.eventLog.savelog("users.ts", "doPasswordReset", "useFetch", null, this.eventLog.concatErrorMessage(response.error, req.body));
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
                this.eventLog.savelog("users.ts", "forgotUsername", "useFetch", null, this.eventLog.concatErrorMessage(response.error, req.body));
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
                this.eventLog.savelog("users.ts", "getUser", "useFetch", null, this.eventLog.concatErrorMessage(response.error, req.body));
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

        return response ? response.message : null;
    }


    private async getLoginUrl() {
        if (this.loginUrl === null) {
            let secrets = await useSecrets(this.eventLog.savelog, null);
            this.loginUrl = secrets.login + (secrets.login.slice(-1) === "/" ? "" : "/");
            //console.log(this.loginUrl);
        }

        return this.loginUrl;
    }
}
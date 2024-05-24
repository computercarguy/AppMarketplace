import { Container, Service } from "typedi";
import * as settings from '../../Settings.json';
import useFetch from '../hooks/useFetch';
import { ApiResponse } from '../models/ApiResponse';
import useGetBearerToken from '../hooks/useGetBearerToken';
import { Request } from "express-serve-static-core";
import useAwsSecrets from '../hooks/useAwsSecrets';
import { EventLog } from "./eventLog";
import { UtilitiesCreditsDb } from "../db/utilitiesCreditsDb";
import { UtilitiesCreditsData } from "../models/UtilitiesCreditsData";

@Service()
export class Authentication {
    private loginUrl: String = null;
    private eventLog = Container.get(EventLog);
    private utilitiesCreditsDb = Container.get(UtilitiesCreditsDb);

    async getUserId(req: Request, cbFunc: Function) {
        let token = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.auth.getUserId;

        useFetch(url, "get", token, null, (response: ApiResponse) => {
            cbFunc(response.message);
        });
    }

    async logout(req: Request, logoutType: number, cbFunc: Function) {
        let authToken = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.user.logout;

        useFetch(url, "post", authToken, JSON.stringify({"logoutType": logoutType}), cbFunc);
    }

    async registerUser(req: Request, cbFunc: Function) {
        let url = await this.getLoginUrl() + settings.urls.auth.register;

        let callback = (response: ApiResponse) => {
            
            if (!response.error) {
                let id: string;
                if (typeof response.message == "string") {
                    let splitSuccess = response.message.split(":");
                    id = splitSuccess[1].trim();
                    response.message = splitSuccess[0];
                }
                else if (typeof response.message == "object") {
                    id = response.message["userId"];
                }
                
                let data = {
                    OAuthUserId: parseInt(id),
                    UtilitiesId: 1,
                    QuantityPurchased: 3
                };

                this.utilitiesCreditsDb.upsert(data as UtilitiesCreditsData, null);
            }

            cbFunc(response);
        };

        useFetch(url, "post", null, JSON.stringify(req.body), callback, "application/json; charset=utf-8");
    }

    async validateUser(req: Request, cbFunc: Function) {
        let authToken = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.auth.validateUser;

        useFetch(url, "get", authToken, null, cbFunc);
    }

    async login(req: Request, cbFunc: Function) {
        let loginUrl = await this.getLoginUrl() as string;
        let url = loginUrl + settings.urls.auth.login;

        req.body["grant_type"] = "password";
        req.body["client_id"] = "auth";
        req.body["client_secret"] = "1234";

        useFetch(url, "post", null, new URLSearchParams(req.body).toString(), cbFunc, "application/x-www-form-urlencoded");
    }

    async getPasswordComplexity(req: Request, cbFunc: Function) {
        let url = await this.getLoginUrl() + settings.urls.auth.getPasswordComplexity;
        useFetch(url, "get", null, null, cbFunc, "application/x-www-form-urlencoded");
    }

    private async getLoginUrl() {
        if (this.loginUrl === null) {
            let secrets = await useAwsSecrets(this.eventLog.savelog, null);

            if (!secrets) {
                return null;
            }

            this.loginUrl = secrets.login + (secrets.login.slice(-1) === "/" ? "" : "/");
            //console.log(this.loginUrl);
        }

        return this.loginUrl;
    }
}
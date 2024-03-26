import { Service } from 'typedi';
import * as settings from '../../Settings.json';
import useFetch from '../hooks/useFetch';
import { ApiResponse } from '../models/ApiResponse';
import useGetBearerToken from '../hooks/useGetBearerToken';
import { Request } from "express-serve-static-core";
import useAwsSecrets from '../hooks/useAwsSecrets';

@Service()
export class Authentication {
    private loginUrl: String = null;

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
        console.log("loginUrl: " + this.loginUrl);
        console.log("url: " + url);
        
        useFetch(url, "post", null, JSON.stringify(req.body), cbFunc, "application/json; charset=utf-8");
    }

    async validateUser(req: Request, cbFunc: Function) {
        let authToken = useGetBearerToken(req);
        let url = await this.getLoginUrl() + settings.urls.auth.validateUser;

        useFetch(url, "get", authToken, null, cbFunc);
    }

    async login(req: Request, cbFunc: Function) {
        let url = await this.getLoginUrl() + settings.urls.auth.login;
        console.log("loginUrl: " + this.loginUrl);
        console.log("url: " + url);

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
            let secrets = await useAwsSecrets(null);

            if (!secrets) {
                return null;
            }

            this.loginUrl = secrets.login;
        }

        return this.loginUrl;
    }
}
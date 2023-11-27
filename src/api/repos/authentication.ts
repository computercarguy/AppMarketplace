import { Service } from 'typedi';
import * as settings from '../../Settings.json';
import useFetch from '../hooks/useFetch';
import { ApiResponse } from '../models/ApiResponse';
import useGetBearerToken from '../hooks/useGetBearerToken';
import { Request } from "express-serve-static-core";

@Service()
export class Authentication {
    getUserId(req: Request, cbFunc: Function) {
        let token = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.auth.getUserId;

        useFetch(url, "get", token, null, (response: ApiResponse) => {
            cbFunc(response.message);
        });
    }

    logout(req: Request, logoutType: number, cbFunc: Function) {
        let authToken = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.user.logout;

        useFetch(url, "post", authToken, JSON.stringify({"logoutType": logoutType}), cbFunc);
    }

    registerUser(req: Request, cbFunc: Function) {
        let url = settings.loginUrl + settings.urls.auth.register;
        useFetch(url, "post", null, req.body, cbFunc);
    }

    validateUser(req: Request, cbFunc: Function) {
        let authToken = useGetBearerToken(req);
        let url = settings.loginUrl + settings.urls.auth.validateUser;
        useFetch(url, "get", authToken, null, cbFunc);
    }

    login(req: Request, cbFunc: Function) {
        let url = settings.loginUrl + settings.urls.auth.login;
        
        req.body["grant_type"] = "password";
        req.body["client_id"] = "auth";
        req.body["client_secret"] = "1234";

        fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(req.body)
        })
        .then((res) => {
            const contentType = res.headers.get("content-type");

            if (contentType === "application/json; charset=utf-8"){
                return res.json();
            }
            else {
                return res.text();
            }
        })
        .then((data) => {
            if (cbFunc) {
                cbFunc(data);
            }
        });
    }
}
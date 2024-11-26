import Container from "typedi";
import { EventLog } from "../repos/eventLog";
import { ApiResponse } from "../models/ApiResponse";

export default async function useFetch(url: string, method: string, authToken: string | null, body: string, cbFunc: Function, contentType: string = null) {
    let headerObject = {};
    let eventLog = Container.get(EventLog);

    if (authToken) {
        headerObject["Authorization"] = "bearer " + authToken;
    }

    if (contentType) {
        headerObject["Content-Type"] = contentType;
    }
//console.log(url);
    let response = fetch(url, {
        method: method,
        headers: new Headers(headerObject),
        body: body
    }).then(async function(res) {
        const dataType = res.headers.get("content-type");

        if (dataType === "application/json; charset=utf-8") {
            return [res.json(), res.status];
        }
        else {
            return res.text();
        }
    })
    .then(async ([results, status]) => {
        const resJson = await results;
        if (resJson) {
            let returnValue: ApiResponse;

            if (typeof resJson === "string") {
                returnValue = new ApiResponse();
                returnValue.message = resJson;
            } else {
                returnValue = resJson as ApiResponse;
                returnValue.status = await status;

                if (returnValue.error) {
                    eventLog.savelog("useFetch.ts", "fetch", "then", null, returnValue.error);
                }
            }

            if (cbFunc) {
                cbFunc(returnValue);
            }
            else {
                return returnValue;
            }
        }
        else {
            eventLog.savelog("users.ts", "fetch", "then else", null, JSON.stringify(resJson));
        }
    })
    .catch(error => {
        eventLog.savelog("users.ts", "fetch", "catch", null, JSON.stringify(error));
    });

    if (response && !cbFunc) {
        return response;
    }
}

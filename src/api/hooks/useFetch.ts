import Container from "typedi";
import { EventLogDb } from "../db/eventLogDb";

export default async function useFetch(url: string, method: string, authToken: string | null, body: string, cbFunc: Function, contentType: string = null) {
    let headerObject = {};
    let eventLogDb = Container.get(EventLogDb);

    if (authToken) {
        headerObject["Authorization"] = "bearer " + authToken;
    }

    if (contentType) {
        headerObject["Content-Type"] = contentType;
    }

    let response = fetch(url, { 
        method: method,
        headers: new Headers(headerObject),
        body: body
    }).then(function(res) {
        const dataType = res.headers.get("content-type");

        if (dataType === "application/json; charset=utf-8") {
            return res.json();
        }
        else {
            return res.text();
        }
    })
    .then(function(resJson) {
        if (resJson) {
            if (resJson.error){
                eventLogDb.savelog("useFetch.ts", "fetch", "then", null, resJson.error);
            }

            if (cbFunc) {
                cbFunc(resJson);
            } 
            else {
                return resJson;
            }
        }
        else {
            eventLogDb.savelog("users.ts", "fetch", "then else", null, JSON.stringify(resJson));
        }
    })
    .catch(error => {
        eventLogDb.savelog("users.ts", "fetch", "catch", null, JSON.stringify(error));
    });

    if (response && !cbFunc) {
        return response;
    }
}

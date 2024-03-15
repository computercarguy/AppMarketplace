export default async function useFetch(url: string, method: string, authToken: string | null, body: string, cbFunc: Function, contentType: string = null) {
    let headerObject = {};

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
            if (cbFunc) {
                cbFunc(resJson);
            } 
            else {
                return resJson;
            }
        }
        else {
            console.log(resJson);
        }
    })
    .catch(error => {
        console.log(error);
    });

    if (response && !cbFunc) {
        return response;
    }
}

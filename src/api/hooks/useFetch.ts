function useFetch(url: string, method: string, authToken: string | null, body: string, cbFunc: Function) {
    let header = authToken 
        ? new Headers({ 'Authorization': "bearer " + authToken })
        : new Headers();

    fetch(url, { 
        method: method,
        headers: header,
        body: body
    }).then(function(res) {
        return res.json();
    })
    .then(function(resJson) {
        if (resJson) {
            if (cbFunc) {
                cbFunc(resJson);
            }
        }
        else {
            console.log(resJson);
        }
    })
    .catch(error => {
        console.log(error);
    });
}

export default useFetch;

function useFetchPPD(url, verb, formProps, callback) {
    fetch(url, { 
        method: verb, // verb: put, post, delete, but not get
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams(formProps)
    }).then(function(res) {
        return res.json();
    })
    .then(function(resJson) {
        if (resJson) {
            callback(resJson);
        }
        else {
            console.log(resJson);
        }
    })
    .catch(error => {
        console.log(error);
    });
}

export default useFetchPPD;

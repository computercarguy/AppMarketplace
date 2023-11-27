function useLoginFetch(url, formProps, errorMessage, setActivePage) {
    fetch(url, { 
        method: 'post', 
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: new URLSearchParams(formProps)
    }).then(function(res) {
        return res.json();
    })
    .then(function(resJson) {
        if (resJson.message !== "") {
            setActivePage("Login");
        }
        else {
            alert(errorMessage);
        }
    })
    .catch(error => {
        alert(errorMessage);
    });
}

export default useLoginFetch;

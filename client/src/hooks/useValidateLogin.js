import settings from '../Settings.json';

const useValidateLogin = (authToken, setUser) => {
    const url = process.env.REACT_APP_apiUrl + settings.urls.auth.validateUser;

    fetch(url, { 
        method: 'get', 
        headers: new Headers({
            'Authorization': authToken
        })
    }).then(function(res) {
        return res.json();
    })
    .then(function(resJson) {
        setUser(resJson);
        return;
    });
}

export default useValidateLogin;
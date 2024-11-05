import settings from "../Settings.json";

export default useValidateLogin = (authToken, setUser) => {
    const url = settings.urls.auth.validateUser;

    fetch(url, {
        method: "get",
        headers: new Headers({
            Authorization: authToken
        })
    })
        .then(function (res) {
            return res.json();
        })
        .then(function (resJson) {
            setUser(resJson);
            return;
        });
};

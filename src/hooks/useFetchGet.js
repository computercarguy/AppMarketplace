export default function useFetchGet(url, authToken, callback) {
    let header = authToken ? new Headers({ Authorization: authToken }) : null;

    fetch(url, {
        method: "get",
        headers: header
    })
        .then(function (res) {
            return res.json();
        })
        .then(function (resJson) {
            if (resJson) {
                if (callback) {
                    callback(resJson);
                }
            } else {
                console.log(resJson);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

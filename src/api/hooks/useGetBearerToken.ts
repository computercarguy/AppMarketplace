import { Request } from "express-serve-static-core";

function useGetBearerToken(req: Request) {
    if (!req.headers.authorization) {
        return null;
    }

    let tokens = req.headers.authorization.split(" ");
    
    if (tokens[0].toLowerCase() == "bearer") {
        return tokens[1];    
    }

    return null;
}

export default useGetBearerToken;
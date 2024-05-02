import { Request } from "express-serve-static-core";

export default function useGetBearerToken(req: Request) {
    if (!req.headers.authorization) {
        return null;
    }

    let tokens = req.headers.authorization.split(" ");
    
    if (tokens[0].toLowerCase() == "bearer") {
        console.log(tokens[1]);
        return tokens[1];
    }

    return null;
}

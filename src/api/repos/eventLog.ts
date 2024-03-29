import { Inject, Service } from "typedi";
import { DbWrapper } from "../db/dbWrapper";

@Service()
export class EventLog {
    
    private dbPool: DbWrapper;

    constructor(@Inject() injectedPool: DbWrapper) {
        this.dbPool = injectedPool;
    }
    
    async savelog(filename: string, methodname: string, stage: string, userid: string, message: string) {
        this.dbPool.savelog(filename, methodname, stage, userid, message);
    }
    
    concatErrorMessage(errorMessage: string, jsonBody: any) {
        return `${errorMessage}/r/n/r/n${JSON.stringify(jsonBody)}`;
    }
}
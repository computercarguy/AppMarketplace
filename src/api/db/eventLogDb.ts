import { Inject, Service } from "typedi";
import { DbWrapper } from "./dbWrapper";

@Service()
export class EventLogDb {
    
    private dbPool: DbWrapper;

    constructor(@Inject() injectedPool: DbWrapper) {
        this.dbPool = injectedPool;
    }
    
    log(message: string) {
        let query = `INSERT INTO eventLog (Message)
            VALUES (:message);`; 
        
        const values = {message: message};

        this.dbPool.query(query, values, null);
    }
}
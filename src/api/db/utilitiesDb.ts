import { Inject, Service } from "typedi";
import { DbWrapper } from "./dbWrapper";

@Service()
export class UtilitiesDb {
    
    private dbPool: DbWrapper;

    constructor(@Inject() injectedPool: DbWrapper) {
        this.dbPool = injectedPool;
    }

    getUtilities(cbFunc: any) {
        // TODO: Rewrite this to not need a subquery
        let query = `SELECT utilities.Id, Name, Description, Url,
            (SELECT Price FROM utilitiesPrice where StartDate < NOW() AND UtilitiesId = utilities.Id ORDER BY StartDate DESC LIMIT 1) as Price 
            FROM utilities 
            ORDER BY Name ASC `; 

        this.dbPool.query(query, null, cbFunc);
    }
}
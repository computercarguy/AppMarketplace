import { Inject, Service } from "typedi";
import { UserData } from "../models/UserData";
import { UtilitiesCreditsData } from "../models/UtilitiesCreditsData";
import { DbWrapper } from "./dbWrapper";

@Service()
export class UtilitiesCreditsDb {
    private dbPool: DbWrapper;

    constructor(@Inject() injectedPool: DbWrapper) {
        this.dbPool = injectedPool;
    }

    getUtilitiesCredits(data: UserData | UtilitiesCreditsData, cbFunc: any) {
        let query = `SELECT utilitiescredits.Id, Name, QuantityPurchased, QuantityUsed, (QuantityPurchased - QuantityUsed) as Available 
            FROM utilitiescredits 
            Left Join utilities on utilities.Id = utilitiescredits.UtilitiesId 
            WHERE OAuthUserId = :userId `; 

        if (data.UtilitiesId){
            query += `AND UtilitiesId = :utilitiedId;`;
        }

        const values = {userId: data.OAuthUserId.toString(), utilitiedId: data.UtilitiesId ? data.UtilitiesId.toString() : null};

        this.dbPool.query(query, values, cbFunc);
    }

    upsert(data: UtilitiesCreditsData, cbFunc: any) {
        this.getUtilitiesCredits(data, (results) => {
            if (results.results.length > 0) {
                let record: UtilitiesCreditsData = results.results[0];
                if (data.QuantityPurchased) {
                    record.QuantityPurchased += Number(data.QuantityPurchased);
                }

                if (data.QuantityUsed) {
                    record.QuantityUsed += Number(data.QuantityUsed);
                }
                
                this.update(record, cbFunc);
            }
            else {
                this.insert(data, cbFunc);
            }
        })
    }

    private insert(data: UtilitiesCreditsData, cbFunc: any) {
        if (!data.QuantityPurchased) {
            data.QuantityPurchased = 0;
        }

        if (!data.QuantityUsed) {
            data.QuantityUsed = 0;
        }

        const query = `INSERT INTO utilitiescredits 
            (OAuthUserId, UtilitiesId, QuantityPurchased, QuantityUsed)
            VALUES (:OAuthUserId, :UtilitiesId, :QuantityPurchased, :QuantityUsed);`;
        this.dbPool.query(query, data, cbFunc);
    }

    private update(data: UtilitiesCreditsData, cbFunc: any) {
        let updateValues: string[] = [];

        if (data.QuantityPurchased) {
            updateValues.push("QuantityPurchased = :QuantityPurchased");
        }

        if (data.QuantityUsed) {
            updateValues.push("QuantityUsed = :QuantityUsed");
        }

        if (updateValues.length == 0) {
            if (cbFunc) {
                cbFunc(null);
            }

            return;
        }

        const query = `UPDATE utilitiescredits 
            SET ${updateValues.join(", ")} 
            WHERE Id = :Id;`;
            
        this.dbPool.query(query, data, cbFunc);
    }
}
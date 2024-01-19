import { Inject, Service } from "typedi";
import { UserData } from "../models/UserData";
import { UtilitiesCreditsData } from "../models/UtilitiesCreditsData";
import { DbWrapper } from "./dbWrapper";
import { UtilitiesCreditsUsedDb } from "./utilitiesCreditsUsedDb";

@Service()
export class UtilitiesCreditsDb {
    private dbPool: DbWrapper;
    private utilitiesCreditsUsedDb: UtilitiesCreditsUsedDb;

    constructor(@Inject() injectedPool: DbWrapper, @Inject() injectedUtilitiesCreditsUsedDb: UtilitiesCreditsUsedDb) {
        this.dbPool = injectedPool;
        this.utilitiesCreditsUsedDb = injectedUtilitiesCreditsUsedDb;
    }

    getUtilitiesCredits(data: UserData | UtilitiesCreditsData, cbFunc: any) {
        let query = `SELECT utilitiescredits.Id, Name, QuantityPurchased, QuantityUsed, (QuantityPurchased - QuantityUsed) as Available 
            FROM utilitiescredits 
            Left Join utilities on utilities.Id = utilitiescredits.UtilitiesId 
            WHERE OAuthUserId = :userId `; 

        if (data.UtilitiesId){
            query += `AND UtilitiesId = :utilitiedId `;
        }

        if (data.UtilitiesGuid){
            query += `AND utilities.UniqueId = ':utilitiesGuid' `;
        }

        const values = {
            userId: data.OAuthUserId.toString(), 
            utilitiedId: data.UtilitiesId ? data.UtilitiesId.toString() : null,
            utilitiesGuid: data.UtilitiesGuid
        };

        this.dbPool.query(query, values, cbFunc);
    }

    upsert(data: UtilitiesCreditsData, cbFunc: any) {
        this.getUtilitiesCredits(data, (results) => {
            if (results.results.length > 0) {
                let record: UtilitiesCreditsData = results.results[0];

                if (data.UtilitiesId && data.QuantityPurchased) {
                    record.QuantityPurchased += Number(data.QuantityPurchased);
                }

                if (!data.UtilitiesId && data.UtilitiesGuid && data.QuantityUsed) {
                    let qtyUsed = Number(data.QuantityUsed);

                    if (record.Available < qtyUsed) {
                        cbFunc();
                        return;
                    }

                    record.QuantityUsed += qtyUsed;
                    record.Available -= qtyUsed;

                    this.utilitiesCreditsUsedDb.insert(record.Id, qtyUsed, null);
                }
                
                this.update(record, cbFunc);
            }
            else {
                this.insert(data, cbFunc);
            }
        });
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
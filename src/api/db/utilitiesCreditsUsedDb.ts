import { Inject, Service } from "typedi";
import { DbWrapper } from "./dbWrapper";

@Service()
export class UtilitiesCreditsUsedDb {
    private dbPool: DbWrapper;

    constructor(@Inject() injectedPool: DbWrapper) {
        this.dbPool = injectedPool;
    }

    public insert(utilitiesCreditsId: number, quantityUsed: number, cbFunc: any) {
        if (!utilitiesCreditsId || quantityUsed < 1) {
            if (cbFunc){
                cbFunc();
            }

            return;
        }

        const values = {
            utilitiesCreditsId: utilitiesCreditsId, 
            quantityUsed: quantityUsed
        };

        const query = `INSERT INTO utilitiescreditsused 
            (UtilitiesCreditsId, QuantityUsed, DateUsed)
            VALUES (:utilitiesCreditsId, :quantityUsed, NOW());`;

        this.dbPool.query(query, values, cbFunc);
    }
}
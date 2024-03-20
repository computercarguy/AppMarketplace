import { Inject, Service } from "typedi";
import { DbWrapper } from "./dbWrapper";

@Service()
export class PaymentMethodImagesDb {
    private dbPool: DbWrapper;

    constructor(@Inject() injectedPool: DbWrapper) {
        this.dbPool = injectedPool;
    }

    getPaymentMethodImages(id: number | null, cbFunc: any) {
        let query = "SELECT Id, Name, Url FROM paymentmethodimages ";

        if (id) {
            query += " WHERE Id = :id ";
        }

        const values = {id: id};

        this.dbPool.query(query, values, cbFunc);
    }
}
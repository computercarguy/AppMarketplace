import { Inject, Service } from "typedi";
import { DbWrapper } from "./dbWrapper";

@Service()
export class PaymentOptionsDb {
    
    private dbPool: DbWrapper;

    constructor(@Inject() injectedPool: DbWrapper) {
        this.dbPool = injectedPool;
    }
    
    getPaymentOptions(userId: number, cbFunc: any) {
        let query = `SELECT StripeCustomer
            FROM paymentoptions 
            WHERE OAuthUserId = :userId;`; 
        
        const values = {userId: userId.toString()};

        this.dbPool.query(query, values, cbFunc);
    }

    updatePaymentOptions(userId: number, stripeCustomer: string, cbFunc: any) {
        let query = `UPDATE paymentoptions 
            set StripeCustomer = :stripeCustomer
            WHERE OAuthUserId = :userId;`; 
        
        const values = {userId: userId.toString(), stripeCustomer: stripeCustomer};

        this.dbPool.query(query, values, cbFunc);
    }

    createPaymentOptions(userId: number, stripeCustomer: string, cbFunc: any) {
        let query = `INSERT INTO paymentoptions (OAuthUserId, StripeCustomer)
            VALUES (:userId, ':stripeCustomer');`; 
        
        const values = {userId: userId.toString(), stripeCustomer: stripeCustomer};

        this.dbPool.query(query, values, cbFunc);
    }
}
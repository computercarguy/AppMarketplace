import { Inject, Service } from "typedi";
import { DbWrapper } from "./dbWrapper";

@Service()
export class InvoicesDb {
    
    private dbPool: DbWrapper;

    constructor(@Inject() injectedPool: DbWrapper) {
        this.dbPool = injectedPool;
    }

    getInvoices(userId: number, invoiceIds: number[], cbFunc: any) {
        const values = {userId: userId.toString()};
        const whereClause = invoiceIds ? ` WHERE id IN ('${invoiceIds.join("','" + "'")}') ` : "";

        const query = `SELECT OAuthUserId, status.Name as Status, PurchasedDate, paymentMethod.Name as PaymentMethod, total
            FROM invoice 
            LEFT JOIN invoicestatus on status.Id = invoice.StatusId
            LEFT JOIN paymentMethod on paymentMethod.Id = invoice.PaymentMethodId
            ${whereClause}
            ORDER BY PurchasedDate ASC `; 

        this.dbPool.query(query, values, cbFunc);
    }
    
    getInvoiceByPaymentIdentifier(userId: number, paymentIdentifier: string, cbFunc: any) {
        const values = {userId: userId.toString(), paymentIdentifier: paymentIdentifier};
        const query = `SELECT Id FROM invoice WHERE OAuthUserId = :userId AND paymentIdentifier = ':paymentIdentifier';`;
        this.dbPool.query(query, values, cbFunc);
    }

    getUserByPaymentIdentifier(paymentIdentifier: string, cbFunc: any) {
        const values = {paymentIdentifier: paymentIdentifier};
        const query = `SELECT OAuthUserId FROM invoice WHERE paymentIdentifier = ':paymentIdentifier';`;
        this.dbPool.query(query, values, cbFunc);
    }
    
    insertInvoice(userId: number, paymentMethodId: number, paymentIdentifier: string, amount: number, cbFunc: any) {
        if (!userId) {
            if (cbFunc) {
                cbFunc();
            }
            
            return;
        }

        const values = {userId: userId.toString(), paymentMethodId: paymentMethodId.toString(), paymentIdentifier: paymentIdentifier, amount: amount};

        const query = `INSERT INTO invoice (OAuthUserId, StatusId, PaymentMethodId, CreatedDate, PaymentIdentifier, total)
            VALUES (:userId, 1, :paymentMethodId, NOW(), ':paymentIdentifier', :amount);`; 

        this.dbPool.query(query, values, cbFunc);
    }

    updateInvoiceByPaymentIdentifier(userId: number, paymentIdentifier: string, confirmationSelections: string[], cbFunc: any) {
        if (!userId) {
            if (cbFunc) {
                cbFunc();
            }
            
            return;
        }

        const values = {userId: userId.toString(), paymentIdentifier: paymentIdentifier};
        let agreements: string = "";

        if (confirmationSelections) {
            if (confirmationSelections.find(c => c[0] === "userAgreementConsent")) {
                agreements += ", userAgreementConsent = 1 ";
            }

            if (confirmationSelections.find(c => c[0] === "paymentMethodConsent")) {
                agreements += ", paymentMethodConsent = 1 ";
            }
        }

        const query = `UPDATE invoice 
            SET StatusId = 2, 
                PurchasedDate = NOW()
                ${agreements}
            WHERE OAuthUserId = :userId AND paymentIdentifier = ':paymentIdentifier';`; 

        this.dbPool.query(query, values, cbFunc);
    }

    confirmInvoiceByPaymentIdentifier(paymentIdentifier: string, cbFunc: any) {
        const values = {paymentIdentifier: paymentIdentifier};

        const query = `UPDATE invoice 
            SET StatusId = 2
            WHERE paymentIdentifier = ':paymentIdentifier';`; 

        this.dbPool.query(query, values, cbFunc);
    }
}
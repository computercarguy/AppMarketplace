import { Inject, Service } from "typedi";
import { DbWrapper } from "./dbWrapper";
import { UtilityItems } from "../models/UtilityItems";
import { InvoiceItem } from "../models/InvoiceItem";

@Service()
export class InvoiceItemsDb {
    
    private dbPool: DbWrapper;

    constructor(@Inject() injectedPool: DbWrapper) {
        this.dbPool = injectedPool;
    }

    getInvoiceItems(invoiceIds: number[] | string, cbFunc: any) {
        let whereClause = "";
        let values = {};

        if (invoiceIds) {
            values['valueString'] = typeof invoiceIds === 'string' ? invoiceIds : invoiceIds.join(',');
            whereClause = ` AND InvoiceId IN (:valueString) `; 
        }

        const query = `SELECT invoiceitem.Id as Id, InvoiceId, UtilitiesId, Price, Qty, utilities.Name as Name
            FROM invoiceitem 
            LEFT JOIN utilities on Utilities.Id = invoiceitem.UtilitiesId
            WHERE Qty <> 0 
            ${whereClause}
            ORDER BY invoiceitem.Id ASC `; 

            this.dbPool.query(query, values, cbFunc);
    }

    upsertInvoiceItems(invoiceId: number, items: UtilityItems[], cbFunc: any) {
        if (!items || !invoiceId || invoiceId < 0) {
            if (cbFunc) {
                cbFunc(false);
            }

            return;
        }

        this.getInvoiceItems([invoiceId], (results) => {
            if (results.results.length > 0) {
                results.results.forEach(invoiceItem => {
                    let item = items.find(item => item.Id === invoiceItem.UtilitiesId);

                    if (item) {
                        // update existing rows with matching 'UtilitiesId's
                        this.updateInvoiceItems(invoiceItem.Id, item, null);
                        let index = items.findIndex(f => f.Id == item.Id);
                        items.splice(index, 1);
                    }
                    else {
                        // update any records that aren't duplicates with Qty = 0 to effectively remove them from the invoice
                        invoiceItem.Qty = 0;
                        this.updateInvoiceItems(invoiceItem.Id, invoiceItem, null);
                    }
                });
            }

            // insert new records
            if (items.length > 0) {
                this.insertInvoiceItems(invoiceId, items, null);
            }

            if (cbFunc) {
                cbFunc(true);
            }
        });
    }

    private updateInvoiceItems(invoiceItemsId: number, item: InvoiceItem | UtilityItems, cbFunc: any) {
        if (!item) {
            if (cbFunc) {
                cbFunc();
            }

            return;
        }

        let values = {invoiceItemsId: invoiceItemsId, price: item.Price, qty: item.Qty};
        
        const query = `UPDATE invoiceitem 
            SET Price = :price,
            Qty = :qty 
            WHERE id = :invoiceItemsId; `;

        this.dbPool.query(query, values, cbFunc);
    }

    private insertInvoiceItems(invoiceId: number, items: UtilityItems[], cbFunc: any) {
        if (!items) {
            if (cbFunc) {
                cbFunc();
            }

            return;
        }

        let values = {};
        let insertValues = [];

        items.forEach((item, i) => {
            insertValues.push(`(:invoiceId${i}, :id${i}, :price${i}, :qty${i})`);
            values[`invoiceId${i}`] = invoiceId;
            values[`id${i}`] = item.Id;
            values[`price${i}`] = item.Price;
            values[`qty${i}`] = item.Qty;
        });

        const query = `INSERT INTO invoiceitem (InvoiceId, UtilitiesId, Price, Qty) 
            VALUES ${insertValues.join(",")}; `;

        this.dbPool.query(query, values, cbFunc);
    }
}
import { Request, Response } from "express-serve-static-core";
import Container, { Service } from "typedi";
import Stripe from 'stripe';
import useSendResponse from "../hooks/useSendResponse";
import { UtilityPurchase } from "../models/UtilityPuchase";
import { PaymentOptionsDb } from "../db/paymentOptionsDb";
import { Authentication } from "./authentication";
import { PaymentOptions } from "../models/PaymentOptions";
import * as settings from '../../Settings.json';
import { StripeCustomer } from "./stripeCustomer";
import { ApiResponse } from "../models/ApiResponse";
import { InvoicesDb } from "../db/invoicesDb";
import { InvoiceItemsDb } from "../db/invoiceItemsDb";
import { UtilitiesCreditsDb } from "../db/utilitiesCreditsDb";
import { UtilitiesCreditsData } from "../models/UtilitiesCreditsData";
import { InvoiceItem } from "../models/InvoiceItem";
import { EventLogDb } from "../db/eventLogDb";
import useAwsSecrets from "../hooks/useAwsSecrets";


const config:Stripe.StripeConfig = {
    apiVersion: settings.stripe.apiVersion as Stripe.StripeConfig["apiVersion"],
    appInfo: { // For sample support and debugging, not required for production:
      name: "stripe-samples/accept-a-payment",
      url: "https://github.com/stripe-samples",
      version: "0.0.2",
    },
    typescript: true,
  };
let stripeKey = null;
let stripe = null;
const auth = Container.get(Authentication);
const eventLogDb = Container.get(EventLogDb);

GetAwsSecrets();

function GetAwsSecrets() {
    useAwsSecrets((secrets) => {
        stripeKey = secrets.stripekey;
        stripe = new Stripe(stripeKey, config);
    });
}

@Service()
export class StripePayments {
    createPaymentIntent(req: Request, res: Response) {
        let total = this.getTotal(req.body);
        let paymentOptionsDb = Container.get(PaymentOptionsDb);
        let stripeCustomer = Container.get(StripeCustomer);
        let invoicesDb = Container.get(InvoicesDb);
        let invoiceItemsDb = Container.get(InvoiceItemsDb);

        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }

            paymentOptionsDb.getPaymentOptions(userId, async (paymentOptions: ApiResponse) => {
                let option = paymentOptions.results[0] as PaymentOptions;

                let stripeCustomerNumber: string = paymentOptions && paymentOptions.results && paymentOptions.results.length > 0
                    ? option.StripeCustomer
                    : await stripeCustomer.createCustomer(userId);

                const paymentIntent = await stripe.paymentIntents.create({
                    customer: stripeCustomerNumber,
                    amount: total * 100,
                    currency: 'usd',
                    automatic_payment_methods: {
                        enabled: true,
                    }
                });

                invoicesDb.insertInvoice(userId, 1, paymentIntent.id, (results) => {
                    invoiceItemsDb.upsertInvoiceItems(results.results.insertId, req.body.Items, null);
                });

                // TODO: should this be in the callback for upsertInvoiceItems?
                useSendResponse(
                    res,
                    paymentIntent ? {"id": paymentIntent.id, "client_secret": paymentIntent.client_secret} : {},
                    paymentIntent == null ? settings.errorMessage : null
                );
            });
        });
    }

    getPaymentMethods(req: Request, res: Response) {
        let paymentOptionsDb = Container.get(PaymentOptionsDb);

        auth.getUserId(req, (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }

            paymentOptionsDb.getPaymentOptions(userId, async (paymentOptions: ApiResponse) => {
                let paymentMethods: Stripe.ApiList<Stripe.PaymentMethod> = null;
                let option = paymentOptions.results[0] as PaymentOptions;

                if (paymentOptions && paymentOptions.results && paymentOptions.results.length > 0) {
                    paymentMethods = await stripe.customers.listPaymentMethods(option.StripeCustomer);
                }

                useSendResponse(
                    res,
                    paymentMethods ? paymentMethods.data : {},
                    null
                );
            });
        }); 
    }

    async updatePaymentIntent(req: Request, res: Response) {
        let invoicesDb = Container.get(InvoicesDb);
        let invoiceItemsDb = Container.get(InvoiceItemsDb);

        auth.getUserId(req, async (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }

            let id = req.body.id;
            let amount = req.body.amount;
            const paymentIntent = await stripe.paymentIntents.update(
                id,
                {amount: amount}
            );

            invoicesDb.getInvoiceByPaymentIdentifier(userId, id, (results) => {
                invoiceItemsDb.upsertInvoiceItems(results.results[0].Id, req.body.Items, null);
            });

            // TODO: should this be in the callback for upsertInvoiceItems?
            useSendResponse(
                res,
                paymentIntent && paymentIntent.id === id && paymentIntent.amount === amount ? paymentIntent : null,
                paymentIntent && paymentIntent.id === id && paymentIntent.amount === amount ? null : settings.errorMessage
            );
        });
    }

    paymentProcessed(req: Request, res: Response) {
        if (!req || !req.body || !req.body.id) {
            useSendResponse(res);
            return;
        }

        let invoicesDb = Container.get(InvoicesDb);
        let invoiceItemsDb = Container.get(InvoiceItemsDb);

        auth.getUserId(req, async (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }

            const paymentIntent = await stripe.paymentIntents.retrieve(req.body.id);

            if (paymentIntent.status !== "succeeded") {
                useSendResponse(res);

                return;
            }

            invoicesDb.updateInvoiceByPaymentIdentifier(userId, req.body.id, req.body.confirmationSelections, null);

            invoicesDb.getInvoiceByPaymentIdentifier(userId, req.body.id, (results) => {
                invoiceItemsDb.upsertInvoiceItems(results.results[0].Id, req.body.Items, null);
            });

            useSendResponse(res, "success", null);
        });
    }

    getKey(req: Request, res: Response) {
        auth.getUserId(req, async (userId: number) => {
            if (!userId) {
                useSendResponse(res);
                return;
            }

            useSendResponse(res, stripeKey, null);
        });
    }

    webhook(req: Request, res: Response) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                req.headers["stripe-signature"],
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } 
        catch (err) {
            eventLogDb.log(`⚠️  Webhook signature verification failed.`);
            res.sendStatus(400);
            return;
        }

        // Extract the data from the event.
        const data: Stripe.Event.Data = event.data;
        const eventType: string = event.type;

        if (eventType === "payment_intent.succeeded") {
            this.PaymentIntentSucceeded(res, req.body.id, data);
        }
        else if (eventType === "payment_intent.payment_failed") {
            // Cast the event into a PaymentIntent to make use of the types.
            const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
            eventLogDb.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
            eventLogDb.log("❌ Payment failed.");
        }

        res.sendStatus(200);
    }

    private PaymentIntentSucceeded(res: Response, paymentIdentifier: string, data: Stripe.Event.Data) {
        // Cast the event into a PaymentIntent to make use of the types.
        const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;
        // Funds have been captured
        // Fulfill any orders, e-mail receipts, etc
        // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds).
        eventLogDb.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
        eventLogDb.log("💰 Payment captured!");

        let invoicesDb = Container.get(InvoicesDb);

        invoicesDb.getUserByPaymentIdentifier(pi.id, (userId) => {
            if (!userId) {
                res.sendStatus(200);
                return;
            }
            
            invoicesDb.confirmInvoiceByPaymentIdentifier(pi.id, null);
            invoicesDb.getInvoiceByPaymentIdentifier(userId.results[0], paymentIdentifier, (results) => {
                let utilitiesCreditsDb = Container.get(UtilitiesCreditsDb);
                let invoiceItemsDb = Container.get(InvoiceItemsDb);

                invoiceItemsDb.getInvoiceItems(results.results[0].Id, (invoiceItems: InvoiceItem[]) => {
                    invoiceItems.forEach((item: InvoiceItem) => {
                        let utilitiesCredits: UtilitiesCreditsData = {OAuthUserId: userId, QuantityPurchased: item.Qty, UtilitiesId: item.Id, Id: null, Available: null, QuantityUsed: null, UtilitiesGuid: item.UtilitiesGuid};

                        utilitiesCreditsDb.upsert(utilitiesCredits, null);
                    });
                });
            });
        });
    }

    private getTotal(body: UtilityPurchase){
        let total = 0;
        
        body.Items.forEach(item => {
            total += item.Price * item.Qty;
        });
    
        return total;
    }
};

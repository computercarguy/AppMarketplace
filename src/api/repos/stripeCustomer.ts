import Container, { Service } from "typedi";
import Stripe from 'stripe';
import { PaymentOptionsDb } from "../db/paymentOptionsDb";
import useSecrets from "../hooks/useSecrets";
import { OAuthUserData } from "../models/OAuthUserData";
import { EventLog } from "./eventLog";

@Service()
export class StripeCustomer {
    private eventLog = Container.get(EventLog);

    private config:Stripe.StripeConfig = {
        apiVersion: '2024-11-20.acacia',
        appInfo: { // For sample support and debugging, not required for production:
        name: "stripe-samples/accept-a-payment",
        url: "https://github.com/stripe-samples",
        version: "0.0.2",
        },
        typescript: true,
    };


    async createCustomer(user: OAuthUserData) {
        var stripe = await this.GetAwsSecrets();

        const customer = await stripe.customers.create({
            description: "OAuthUserId: " + user.Id,
            name: user.FirstName + " " + user.LastName,
            email: user.Email,
            address: {
                line1: user.Address1,
                line2: user.Address2,
                city: user.City,
                state: user.State,
                postal_code: user.Zipcode,
                country: user.Country
            }
        });

        let paymentOptionsDb = Container.get(PaymentOptionsDb);
        paymentOptionsDb.createPaymentOptions(user.Id, customer.id, null);

        return customer.id;
    }

    private async GetAwsSecrets() {
        return await useSecrets(this.eventLog.savelog, (secrets) => {
            return new Stripe(secrets.stripekey_private, this.config);
        });
    }
}
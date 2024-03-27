import Container, { Service } from "typedi";
import Stripe from 'stripe';
import { PaymentOptionsDb } from "../db/paymentOptionsDb";
import useAwsSecrets from "../hooks/useAwsSecrets";
import { OAuthUserData } from "../models/OAuthUserData";
import { EventLog } from "./eventLog";

const config:Stripe.StripeConfig = {
    apiVersion: '2023-10-16',
    appInfo: { // For sample support and debugging, not required for production:
      name: "stripe-samples/accept-a-payment",
      url: "https://github.com/stripe-samples",
      version: "0.0.2",
    },
    typescript: true,
  };
let stripe = null;

GetAwsSecrets();

function GetAwsSecrets() {
    const eventLog = Container.get(EventLog);

    useAwsSecrets(eventLog.savelog, (secrets) => {
        stripe = new Stripe(secrets.stripekey_private, config);
    });
}

@Service()
export class StripeCustomer {
    async createCustomer(user: OAuthUserData) {

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
}
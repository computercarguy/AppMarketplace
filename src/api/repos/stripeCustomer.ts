import Container, { Service } from "typedi";
import Stripe from 'stripe';
import { PaymentOptionsDb } from "../db/paymentOptionsDb";
import useAwsSecrets from "../hooks/useAwsSecrets";


const config:Stripe.StripeConfig = {
    apiVersion: '2023-10-16',
    appInfo: { // For sample support and debugging, not required for production:
      name: "stripe-samples/accept-a-payment",
      url: "https://github.com/stripe-samples",
      version: "0.0.2",
    },
    typescript: true,
  };
let stripeKey = null;
let stripe = null;

GetAwsSecrets();

function GetAwsSecrets() {
    useAwsSecrets((secrets) => {
        stripeKey = secrets.stripekey;
        stripe = new Stripe(stripeKey, config);
    });
}

@Service()
export class StripeCustomer {
    async createCustomer(userId: number){
        const customer = await stripe.customers.create({
            description: userId.toString()
          });

          let paymentOptionsDb = Container.get(PaymentOptionsDb);
          paymentOptionsDb.createPaymentOptions(userId, customer.id, null);

          return customer.id;
    }
}
import {PaymentElement, useStripe, useElements, AddressElement, LinkAuthenticationElement} from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function CheckoutForm(params) {
    const [isDisabled, setDisabled] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    function submit(e) {
        params.handleSubmit(e, stripe, elements, EnablePurchaseButton);
        setDisabled(true);
    }

    function EnablePurchaseButton(){
        setDisabled(false);
    }

    return (
        <form onSubmit={submit}>
            <LinkAuthenticationElement />
            <AddressElement options={{mode:"billing"}} />
            <PaymentElement />
            <br />
            <input type="checkbox" name="userAgreementConsent" id="userAgreementConsent" required /><label htmlFor="userAgreementConsent">I confirm that I have read, consent, and agree to the Eric's Gear User Agreement and Privacy Policy (including the processing and disclosing of my personal or business data), and I am of legal age.</label>
            <br />
            <br />
            <input type="checkbox" name="paymentMethodConsent" id="paymentMethodConsent" required /><label htmlFor="paymentMethodConsent">I confirm that I have the authority and approval to use this payment method for purchase on this website.</label>
            <br />
            <button disabled={isDisabled}>Purchase</button>
        </form>
    );
}

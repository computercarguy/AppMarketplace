import {PaymentElement, useStripe, useElements, AddressElement, LinkAuthenticationElement} from '@stripe/react-stripe-js';


const CheckoutForm = (params) => {
    const stripe = useStripe();
    const elements = useElements();

    function submit(e) {
        params.handleSubmit(e, stripe, elements);
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
            <button>Purchase</button>
        </form>
    );
};

export default CheckoutForm;
import { useEffect, useState } from "react";
import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { loadStripe } from "@stripe/stripe-js";
import settings from '../../Settings.json';

export default function Cart(params) {
    const stripePromise = loadStripe(params.stripekey);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentIntentId, setPaymentIntentId] = useState("");
    const [ranUseEffect, setRanUseEffect] = useState(false);
    const token = sessionStorage.getItem('token');
    const checkoutUrl = process.env.REACT_APP_apiUrl + settings.stripe.paymentProcess;

    const options = {
        clientSecret: clientSecret,
        appearance: { theme: 'stripe' },
        loader: "auto"
    };
    
    async function SubmitPayment(stripe, elements, data) {
        const {error: submitError} = await elements.submit();

        if (submitError) {
            console.log(submitError);
            return;
        }

        await stripe.confirmPayment(
            {
                elements: elements,
                redirect: "if_required"
            }
        ).then(function(result) {
            if (!result) {
                alert('Payment failed to process');
            } 
            else if (result.error) {
                if (result.error.payment_intent && result.error.payment_intent.status === "succeeded") {
                    SubmitItems(data, result.error.payment_intent.id);
                }
                else {
                    alert('Card error: ' + result.error.message);
                }
            }
            else {
                if (result.paymentIntent.id) {
                    SubmitItems(data, result.paymentIntent.id);
                }
                else {
                    alert('Payment failed');
                }
            }
        });
    }

    function SubmitItems(data, intentId) {
        let url = process.env.REACT_APP_apiUrl + settings.stripe.paymentProcessed;
        let amount = params.calculateTotal();

        fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                'Authorization': token
            },
            body: JSON.stringify({ 
                id: intentId,
                amount: amount * 100,
                Items: params.items,
                confirmationSelections: [...data.entries()]
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data) {
                if (data.message && data.message === "success") {
                    params.paymentComplete();
                }
                else {
                    if (data.error) {
                        if (data.error.payment_intent && data.error.payment_intent.status === "succeeded") {
                            params.paymentComplete();
                        }
                        else {
                            alert('Processing error: ' + data.error.message);
                        }
                    }
                    else {
                        alert('Processing error');
                    }
                }
            }
            else {
                alert('Processing error');
            }
        });
    }

    function HandleSubmit(e, stripe, elements) {
        e.preventDefault();
        const data = new FormData(e.target);
        
        let amount = params.calculateTotal();

        if (amount !== params.total) {
            let url = process.env.REACT_APP_apiUrl + settings.stripe.updatePaymentIntent
            fetch(url, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': token
                },
                body: JSON.stringify({ 
                    id: paymentIntentId,
                    amount: amount * 100,
                    Items: params.items
                }),
            })
            .then((res) => res.json())
            .then(async (data) => {
                if (data && data.message) {
                    SubmitPayment(stripe, elements, data);
                }
            });
        }
        else {
            SubmitPayment(stripe, elements, data);
        }
    }

    useEffect(() => {
        if (!ranUseEffect) {
            setRanUseEffect(true); // prevent creating multiple payment intents

            // Create PaymentIntent as soon as the page loads
            let url = process.env.REACT_APP_apiUrl + settings.stripe.createPaymentIntent;
            
            fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': token
                },
                body: JSON.stringify({ Items: params.items }),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.message) {
                    setClientSecret(data.message.client_secret);
                    setPaymentIntentId(data.message.id);
                }
            });
        }
    }, [token, params, ranUseEffect]);

    return (
        <div>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise} id="stripeElement">
                    <CheckoutForm handleSubmit={HandleSubmit} url={checkoutUrl} />
                </Elements>
            )}
        </div>
    );
}
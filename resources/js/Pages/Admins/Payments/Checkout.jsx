import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Layout from "@/Layouts/Layout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = ({ amount, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const { post, errors } = useForm();
    const { cart } = usePage().props;

    // Create PaymentIntent when component mounts
    useEffect(() => {
        axios
            .post("/create-payment-intent", { amount: amount * 100 })
            .then((response) => {
                setClientSecret(response.data.clientSecret);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [amount]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        const { error: stripeError, paymentIntent } =
            await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: "Customer Name", // Replace with actual customer data
                    },
                },
            });

        if (stripeError) {
            setError(stripeError.message);
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === "succeeded") {
            // Save to database
            post(
                "/process-payment",
                {
                    payment_intent_id: paymentIntent.id,
                    amount: amount,
                    cart_id: cart.id,
                },
                {
                    onSuccess: () => onSuccess(paymentIntent.id),
                }
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border rounded p-3">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#424770",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            {errors.payment && (
                <div className="text-red-500 text-sm">{errors.payment}</div>
            )}

            <button
                type="submit"
                disabled={!stripe || processing}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${
                    !stripe || processing ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
            </button>
        </form>
    );
};

const CheckoutPage = () => {
    const { cart } = usePage().props;
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [paymentId, setPaymentId] = useState(null);

    const handlePaymentSuccess = (paymentIntentId) => {
        setPaymentCompleted(true);
        setPaymentId(paymentIntentId);
    };

    if (paymentCompleted) {
        return (
            <Layout>
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">
                        Payment Successful!
                    </h2>
                    <p className="mb-4">Thank you for your purchase.</p>
                    <p className="text-sm text-gray-600">
                        Payment ID: {paymentId}
                    </p>
                    <a
                        href="/orders"
                        className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        View Your Orders
                    </a>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head title="Checkout" />

            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Checkout</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Payment Details
                        </h2>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <Elements stripe={stripePromise}>
                                <CheckoutForm
                                    amount={cart.total}
                                    onSuccess={handlePaymentSuccess}
                                />
                            </Elements>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Order Summary
                        </h2>
                        <div className="bg-white p-6 rounded-lg shadow">
                            {cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between py-3 border-b"
                                >
                                    <div>
                                        <h3 className="font-medium">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p>
                                            $
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between font-semibold">
                                    <span>Total:</span>
                                    <span>${cart.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutPage;

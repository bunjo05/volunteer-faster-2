<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount,
                'currency' => 'usd',
                'metadata' => [
                    'integration_check' => 'accept_a_payment'
                ]
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function processPayment(Request $request)
    {
        // Validate the request
        $request->validate([
            'payment_intent_id' => 'required|string',
            'amount' => 'required|numeric',
            'cart_id' => 'required|exists:carts,id'
        ]);

        // Process the payment (save to database, etc.)
        try {
            $order = auth()->user()->orders()->create([
                'payment_intent_id' => $request->payment_intent_id,
                'amount' => $request->amount,
                'status' => 'completed',
            ]);

            // Add cart items to order
            $cart = Cart::find($request->cart_id);
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ]);
            }

            // Clear the cart
            $cart->items()->delete();

            return redirect()->route('checkout.success')->with('payment_id', $request->payment_intent_id);
        } catch (\Exception $e) {
            return back()->withErrors(['payment' => 'Payment processing failed: ' . $e->getMessage()]);
        }
    }
}

<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Stripe\Webhook;
use App\Models\Sponsorship;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Log;
use App\Models\VolunteerSponsorship;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\SponsorshipDonationReceivedMail;
use Symfony\Component\HttpFoundation\Response;
use Stripe\Exception\SignatureVerificationException;

class SponsorshipPaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        try {
            $request->validate([
                'sponsorship_public_id' => 'required|exists:volunteer_sponsorships,public_id',
                'amount' => 'required|numeric|min:1',
                'funding_allocation' => 'nullable|array',
                'custom_amount' => 'nullable|numeric',
                'is_anonymous' => 'nullable|boolean'
            ]);

            $sponsorship = VolunteerSponsorship::with(['user', 'booking.project'])
                ->where('public_id', $request->sponsorship_public_id)
                ->firstOrFail();

            Stripe::setApiKey(config('services.stripe.secret'));

            // Get user public_id if logged in, otherwise null
            $userPublicId = Auth::check() ? Auth::user()->public_id : null;

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => 'Sponsorship for ' . $sponsorship->user->name,
                            'description' => 'Support for volunteer project: ' . $sponsorship->booking->project->title,
                        ],
                        'unit_amount' => round($request->amount * 100),
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('sponsorship.payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('sponsorship.payment.cancel'),
                'metadata' => [
                    'sponsorship_public_id' => $sponsorship->public_id,
                    'user_public_id' => $userPublicId,
                    'booking_public_id' => $sponsorship->booking_public_id,
                    'amount' => (float) $request->amount,
                    'funding_allocation' => json_encode($request->funding_allocation),
                    'custom_amount' => $request->custom_amount,
                    'is_anonymous' => $request->boolean('is_anonymous'),
                ],
            ]);

            return response()->json(['sessionId' => $session->id]);
        } catch (\Exception $e) {
            Log::error('Sponsorship payment error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function handleSuccess(Request $request)
    {
        $sessionId = $request->get('session_id');

        try {
            Stripe::setApiKey(config('services.stripe.secret'));
            $session = Session::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                $sponsorshipPublicId = $session->metadata->sponsorship_public_id ?? null;
                $userPublicId = $session->metadata->user_public_id ?? null;
                $bookingPublicId = $session->metadata->booking_public_id ?? null;
                $amount = isset($session->metadata->amount) ? (float) $session->metadata->amount : null;
                $isAnonymous = filter_var($session->metadata->is_anonymous ?? false, FILTER_VALIDATE_BOOLEAN);

                if (!$sponsorshipPublicId || !$bookingPublicId) {
                    Log::error('Stripe success: Missing required metadata in session', [
                        'session_id' => $session->id,
                        'sponsorship_public_id' => $sponsorshipPublicId,
                        'booking_public_id' => $bookingPublicId
                    ]);
                    throw new \Exception('Missing required metadata in session');
                }

                // Find the sponsorship with user relationship
                $sponsorship = VolunteerSponsorship::with(['user', 'booking.project'])
                    ->where('public_id', $sponsorshipPublicId)
                    ->first();

                if (!$sponsorship) {
                    Log::error('Stripe success: Sponsorship not found', [
                        'sponsorship_public_id' => $sponsorshipPublicId
                    ]);
                    throw new \Exception('Sponsorship not found');
                }

                // Try to find payment by payment_intent
                $payment = Sponsorship::where('stripe_payment_id', $session->payment_intent)->first();

                if (!$payment) {
                    // Check if payment already exists
                    $payment = Sponsorship::where([
                        'sponsorship_public_id' => $sponsorshipPublicId,
                        'booking_public_id' => $bookingPublicId,
                        'amount' => $amount
                    ])
                        ->when($userPublicId, function ($query, $userPublicId) {
                            return $query->where('user_public_id', $userPublicId);
                        }, function ($query) {
                            return $query->whereNull('user_public_id');
                        })
                        ->whereIn('status', ['completed', 'pending'])
                        ->first();

                    if (!$payment) {
                        // Create payment record
                        $payment = Sponsorship::create([
                            'public_id' => \Illuminate\Support\Str::ulid(),
                            'user_public_id' => $userPublicId,
                            'booking_public_id' => $bookingPublicId,
                            'sponsorship_public_id' => $sponsorshipPublicId,
                            'amount' => $amount,
                            'funding_allocation' => json_decode($session->metadata->funding_allocation ?? '[]', true),
                            'stripe_payment_id' => $session->payment_intent,
                            'status' => 'completed',
                            'is_anonymous' => $isAnonymous,
                            'payment_method' => $session->payment_method_types[0] ?? 'card',
                        ]);
                    } else {
                        // Update existing payment
                        $payment->update([
                            'status' => 'completed',
                            'payment_method' => $session->payment_method_types[0] ?? 'card',
                            'stripe_payment_id' => $session->payment_intent,
                            'user_public_id' => $userPublicId,
                            'is_anonymous' => $isAnonymous,
                        ]);
                    }
                } else {
                    // Update payment status if pending
                    if ($payment->status === 'pending') {
                        $payment->update([
                            'status' => 'completed',
                            'payment_method' => $session->payment_method_types[0] ?? 'card',
                            'user_public_id' => $userPublicId,
                            'is_anonymous' => $isAnonymous,
                        ]);
                    }
                }

                // Update sponsorship with funded amount
                $sponsorship->increment('funded_amount', $payment->amount);

                // Send email notification to sponsorship owner
                $this->sendDonationNotification($sponsorship, $payment);

                // Redirect based on authentication status
                if (Auth::check()) {
                    return redirect()->route('dashboard')
                        ->with('success', 'Thank you for your sponsorship! Your payment was successful.');
                } else {
                    return redirect()->route('home')
                        ->with('success', 'Thank you for your sponsorship! Your payment was successful.');
                }
            }
        } catch (\Exception $e) {
            Log::error('Sponsorship payment success handling error: ' . $e->getMessage(), [
                'session_id' => $sessionId
            ]);
        }

        return redirect()->route('sponsorship.payment.cancel');
    }

    protected function sendDonationNotification($sponsorship, $payment)
    {
        try {
            // Check if sponsorship has a user and the user has an email
            if ($sponsorship->user && $sponsorship->user->email) {
                Mail::to($sponsorship->user->email)
                    ->send(new SponsorshipDonationReceivedMail($sponsorship, $payment));

                Log::info('Sponsorship donation notification sent', [
                    'sponsorship_public_id' => $sponsorship->public_id,
                    'recipient_email' => $sponsorship->user->email,
                    'amount' => $payment->amount
                ]);
            } else {
                Log::warning('Could not send sponsorship donation notification - missing user or email', [
                    'sponsorship_public_id' => $sponsorship->public_id,
                    'has_user' => !is_null($sponsorship->user),
                    'has_email' => $sponsorship->user && !empty($sponsorship->user->email)
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send sponsorship donation notification: ' . $e->getMessage(), [
                'sponsorship_public_id' => $sponsorship->public_id
            ]);
        }
    }

    public function handleCancel()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard')
                ->with('error', 'Sponsorship payment was cancelled.');
        } else {
            return redirect()->route('home')
                ->with('error', 'Sponsorship payment was cancelled.');
        }
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $webhookSecret
            );
        } catch (\UnexpectedValueException $e) {
            Log::error('Stripe webhook error (Invalid payload): ' . $e->getMessage());
            return response()->json(['error' => 'Invalid payload'], Response::HTTP_BAD_REQUEST);
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe webhook error (Invalid signature): ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], Response::HTTP_BAD_REQUEST);
        }

        Log::info('Stripe webhook received: ' . $event->type);

        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $this->handleCheckoutSessionCompleted($session);
                break;

            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                $this->handlePaymentIntentSucceeded($paymentIntent);
                break;

            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;
                $this->handlePaymentIntentFailed($paymentIntent);
                break;

            default:
                Log::info('Unhandled Stripe event type: ' . $event->type);
        }

        return response()->json(['success' => true]);
    }

    protected function handleCheckoutSessionCompleted($session)
    {
        try {
            if ($session->payment_status === 'paid') {
                $sponsorshipPublicId = $session->metadata->sponsorship_public_id ?? null;
                $userPublicId = $session->metadata->user_public_id ?? null;
                $bookingPublicId = $session->metadata->booking_public_id ?? null;
                $amount = isset($session->metadata->amount) ? (float) $session->metadata->amount : null;
                $isAnonymous = filter_var($session->metadata->is_anonymous ?? false, FILTER_VALIDATE_BOOLEAN);

                if (!$sponsorshipPublicId || !$bookingPublicId) {
                    Log::error('Stripe webhook: Missing required metadata in session', [
                        'session_id' => $session->id,
                        'sponsorship_public_id' => $sponsorshipPublicId,
                        'booking_public_id' => $bookingPublicId
                    ]);
                    return;
                }

                // Check if payment already exists
                $existingPayment = Sponsorship::where('stripe_payment_id', $session->payment_intent)->first();
                if ($existingPayment) {
                    if ($existingPayment->status !== 'completed') {
                        $existingPayment->update([
                            'status' => 'completed',
                            'payment_method' => $session->payment_method_types[0] ?? 'card',
                            'user_public_id' => $userPublicId,
                            'is_anonymous' => $isAnonymous,
                        ]);
                    }
                    Log::info('Stripe webhook: Payment already processed', [
                        'payment_intent' => $session->payment_intent
                    ]);
                    return;
                }

                // Find the sponsorship with user relationship
                $sponsorship = VolunteerSponsorship::with(['user', 'booking.project'])
                    ->where('public_id', $sponsorshipPublicId)
                    ->first();

                if (!$sponsorship) {
                    Log::error('Stripe webhook: Sponsorship not found', [
                        'sponsorship_public_id' => $sponsorshipPublicId
                    ]);
                    return;
                }

                // Create payment record
                $payment = Sponsorship::create([
                    'public_id' => \Illuminate\Support\Str::ulid(),
                    'user_public_id' => $userPublicId,
                    'booking_public_id' => $bookingPublicId,
                    'sponsorship_public_id' => $sponsorshipPublicId,
                    'amount' => $amount,
                    'funding_allocation' => json_decode($session->metadata->funding_allocation ?? '[]', true),
                    'stripe_payment_id' => $session->payment_intent,
                    'status' => 'completed',
                    'is_anonymous' => $isAnonymous,
                    'payment_method' => $session->payment_method_types[0] ?? 'card',
                ]);

                // Update sponsorship with funded amount
                $sponsorship->increment('funded_amount', $amount);

                // Send email notification to sponsorship owner
                $this->sendDonationNotification($sponsorship, $payment);

                Log::info('Stripe webhook: Sponsorship payment processed successfully', [
                    'sponsorship_public_id' => $sponsorshipPublicId,
                    'payment_intent' => $session->payment_intent,
                    'amount' => $amount,
                    'user_public_id' => $userPublicId,
                    'is_anonymous' => $isAnonymous
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Stripe webhook error in handleCheckoutSessionCompleted: ' . $e->getMessage(), [
                'session_id' => $session->id ?? null
            ]);
        }
    }

    protected function handlePaymentIntentSucceeded($paymentIntent)
    {
        Log::info('PaymentIntent succeeded: ' . $paymentIntent->id);
    }

    protected function handlePaymentIntentFailed($paymentIntent)
    {
        $sponsorshipPublicId = $paymentIntent->metadata->sponsorship_public_id ?? null;

        if ($sponsorshipPublicId) {
            $payment = Sponsorship::where('stripe_payment_id', $paymentIntent->id)->first();

            if ($payment) {
                $payment->update([
                    'status' => 'failed',
                ]);

                Log::info('Payment failed for sponsorship', [
                    'sponsorship_public_id' => $sponsorshipPublicId,
                    'payment_intent' => $paymentIntent->id,
                    'failure_message' => $paymentIntent->last_payment_error->message ?? null
                ]);
            }
        }
    }
}

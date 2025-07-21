<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Stripe\Webhook;
use App\Models\Admin;
use App\Models\Payment;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use App\Models\VolunteerBooking;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Notification;
use Symfony\Component\HttpFoundation\Response;
use App\Notifications\PaymentSuccessfulNotification;
use Stripe\Exception\SignatureVerificationException;



class StripePaymentController extends Controller
{
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
            // Invalid payload
            Log::error('Stripe webhook error (Invalid payload): ' . $e->getMessage());
            return response()->json(['error' => 'Invalid payload'], Response::HTTP_BAD_REQUEST);
        } catch (SignatureVerificationException $e) {
            // Invalid signature
            Log::error('Stripe webhook error (Invalid signature): ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], Response::HTTP_BAD_REQUEST);
        }

        Log::info('Stripe webhook received: ' . $event->type);

        // Handle the event
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

            case 'charge.refunded':
                $charge = $event->data->object;
                $this->handleChargeRefunded($charge);
                break;

            // Add more cases for other events you want to handle

            default:
                Log::info('Unhandled Stripe event type: ' . $event->type);
        }

        return response()->json(['success' => true]);
    }

    protected function handleCheckoutSessionCompleted($session)
    {
        try {
            if ($session->payment_status === 'paid') {
                $bookingId = $session->metadata->booking_id ?? null;
                $userId = $session->metadata->user_id ?? null;
                $fullAmount = $session->metadata->full_amount ?? null;
                $depositAmount = $session->metadata->deposit_amount ?? null;

                if (!$bookingId || !$userId) {
                    Log::error('Stripe webhook: Missing metadata in session', ['session_id' => $session->id]);
                    return;
                }

                $booking = VolunteerBooking::with(['user', 'project.user'])
                    ->where('id', $bookingId)
                    ->where('user_id', $userId)
                    ->first();

                if (!$booking) {
                    Log::error('Stripe webhook: Booking not found', [
                        'booking_id' => $bookingId,
                        'user_id' => $userId
                    ]);
                    return;
                }

                $existingPayment = Payment::where('stripe_payment_id', $session->payment_intent)->first();
                if ($existingPayment) {
                    Log::info('Stripe webhook: Payment already processed', [
                        'payment_intent' => $session->payment_intent
                    ]);
                    return;
                }

                // Create payment record with deposit information
                $payment = Payment::create([
                    'user_id' => $userId,
                    'booking_id' => $bookingId,
                    'project_id' => $booking->project_id,
                    'amount' => $depositAmount,
                    'full_amount' => $fullAmount,
                    'stripe_payment_id' => $session->payment_intent,
                    'status' => 'deposit_paid',
                    'payment_method' => $session->payment_method_types[0] ?? 'card',
                    'payment_type' => 'deposit',
                ]);

                // Update booking status
                $booking->update([
                    'payment_status' => 'deposit_paid',
                    'stripe_session_id' => $session->id,
                    'paid_at' => now(),
                    'amount_paid' => $depositAmount,
                    'total_amount' => $fullAmount,
                ]);

                // Send notifications
                $this->sendPaymentNotifications($booking, $payment);

                Log::info('Stripe webhook: Deposit payment processed successfully', [
                    'booking_id' => $bookingId,
                    'payment_intent' => $session->payment_intent,
                    'deposit_amount' => $depositAmount,
                    'full_amount' => $fullAmount
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
        // This is a backup handler in case checkout.session.completed isn't enough
        // You might want to implement additional logic here
        Log::info('PaymentIntent succeeded: ' . $paymentIntent->id);
    }

    protected function handlePaymentIntentFailed($paymentIntent)
    {
        $bookingId = $paymentIntent->metadata->booking_id ?? null;
        $userId = $paymentIntent->metadata->user_id ?? null;

        if ($bookingId && $userId) {
            $booking = VolunteerBooking::where('id', $bookingId)
                ->where('user_id', $userId)
                ->first();

            if ($booking) {
                $booking->update([
                    'payment_status' => 'failed',
                    'payment_failed_at' => now(),
                ]);

                Log::info('Payment failed for booking', [
                    'booking_id' => $bookingId,
                    'payment_intent' => $paymentIntent->id,
                    'failure_message' => $paymentIntent->last_payment_error->message ?? null
                ]);
            }
        }
    }

    public function checkout(Request $request)
    {
        try {
            $request->validate([
                'booking_id' => 'required|exists:volunteer_bookings,id'
            ]);

            $booking = $request->user()->bookings()
                ->with(['project.user']) // Load project with its user
                ->findOrFail($request->booking_id);

            if (!$booking->project) {
                throw new \Exception('Project not found for this booking');
            }

            // Calculate full amount
            $fullAmount = $this->calculateTotalAmount(
                $booking->start_date,
                $booking->end_date,
                $booking->project->fees,
                $booking->number_of_travellers
            );

            // Calculate 10% deposit
            $depositAmount = $fullAmount * 0.1;

            Stripe::setApiKey(config('services.stripe.secret'));

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $booking->project->title . ' (10% Deposit)',
                            'description' => 'Deposit for volunteer project booking',
                        ],
                        'unit_amount' => round($depositAmount * 100), // Amount in cents
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('payment.cancel'),
                'metadata' => [
                    'booking_id' => $booking->id,
                    'user_id' => $request->user()->id,
                    'full_amount' => $fullAmount,
                    'deposit_amount' => $depositAmount,
                ],
            ]);

            return response()->json(['sessionId' => $session->id]);
        } catch (\Exception $e) {
            Log::error('Stripe checkout error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        Stripe::setApiKey(config('services.stripe.secret'));
        $session = Session::retrieve($sessionId);

        if ($session->payment_status === 'paid') {
            $booking = $request->user()->bookings()
                ->with(['project.user']) // Load project with its user
                ->findOrFail($session->metadata->booking_id);

            $payment = Payment::create([
                'user_id' => $request->user()->id,
                'booking_id' => $booking->id,
                'project_id' => $booking->project_id,
                'amount' => $session->metadata->deposit_amount,
                'full_amount' => $session->metadata->full_amount,
                'stripe_payment_id' => $session->payment_intent,
                'status' => 'deposit_paid',
                'payment_type' => 'deposit'
            ]);

            $booking->update([
                'payment_status' => 'deposit_paid',
                'stripe_session_id' => $sessionId,
                'paid_at' => now(),
                'amount_paid' => $session->metadata->deposit_amount,
                'total_amount' => $session->metadata->full_amount,
            ]);

            // Send notifications
            $this->sendPaymentNotifications($booking, $payment);

            return redirect()->route('volunteer.projects')
                ->with('success', 'Deposit payment completed successfully!');
        }

        return redirect()->route('payment.cancel');
    }

    protected function sendPaymentNotifications($booking, $payment)
    {
        try {
            // Send to paying user
            $booking->user->sendNow(new PaymentSuccessfulNotification($booking, $payment, 'user'));

            // Send to project owner (now accessed via project.user instead of project.owner)
            if ($booking->project->user) {
                $booking->project->user->sendNow(new PaymentSuccessfulNotification($booking, $payment, 'owner'));
            }

            // Send to all admins
            $admins = Admin::all();
            Notification::send($admins, new PaymentSuccessfulNotification($booking, $payment, 'admin'));
        } catch (\Exception $e) {
            Log::error('Failed to send payment notifications: ' . $e->getMessage());
        }
    }

    public function cancel()
    {
        return redirect()->route('volunteer.projects')
            ->with('error', 'Payment was cancelled.');
    }

    protected function calculateTotalAmount($startDate, $endDate, $fees, $travellers)
    {
        $start = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $diff = $start->diff($end);
        $duration = $diff->days + 1;

        return $duration * $fees * $travellers;
    }

    protected function handleChargeRefunded($charge)
    {
        $payment = Payment::where('stripe_payment_id', $charge->payment_intent)->first();

        if ($payment) {
            $payment->update([
                'status' => 'refunded',
                'refunded_at' => now(),
                'refund_amount' => $charge->amount_refunded / 100,
            ]);

            // Update associated booking if needed
            $booking = $payment->booking;
            if ($booking) {
                $booking->update([
                    'payment_status' => 'refunded'
                ]);
            }

            Log::info('Payment refund processed', [
                'payment_id' => $payment->id,
                'charge_id' => $charge->id,
                'refund_amount' => $charge->amount_refunded / 100
            ]);
        }
    }
}

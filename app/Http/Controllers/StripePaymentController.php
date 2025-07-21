<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class StripePaymentController extends Controller
{

    public function checkout(Request $request)
    {
        try {
            $request->validate([
                'booking_id' => 'required|exists:volunteer_bookings,id'
            ]);

            $booking = $request->user()->bookings()
                ->with('project')
                ->findOrFail($request->booking_id);

            if (!$booking->project) {
                throw new \Exception('Project not found for this booking');
            }

            $totalAmount = $this->calculateTotalAmount(
                $booking->start_date,
                $booking->end_date,
                $booking->project->fees,
                $booking->number_of_travellers
            );

            Stripe::setApiKey(config('services.stripe.secret'));

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $booking->project->title,
                        ],
                        'unit_amount' => $totalAmount * 100, // Amount in cents
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('payment.cancel'),
                'metadata' => [
                    'booking_id' => $booking->id,
                    'user_id' => Auth::id(),
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

        // Verify the payment was successful
        if ($session->payment_status === 'paid') {
            // Update your booking status
            $booking = Auth::user()->bookings()->findOrFail($session->metadata->booking_id);
            $booking->update([
                'payment_status' => 'paid',
                'stripe_session_id' => $sessionId,
                'paid_at' => now(),
            ]);

            return redirect()->route('volunteer.projects')
                ->with('success', 'Payment completed successfully!');
        }

        return redirect()->route('payment.cancel');
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
}

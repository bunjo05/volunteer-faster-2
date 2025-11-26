<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use App\Models\Payment;
use App\Models\VolunteerBooking;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use App\Notifications\PaymentSuccessfulNotification;

class PayPalPaymentController extends Controller
{
    private $clientId;
    private $clientSecret;
    private $mode;

    public function __construct()
    {
        $this->clientId = config('services.paypal.client_id');
        $this->clientSecret = config('services.paypal.client_secret');
        $this->mode = config('services.paypal.mode');
    }

    private function getAccessToken()
    {
        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->asForm()
            ->post($this->getBaseUrl() . '/v1/oauth2/token', [
                'grant_type' => 'client_credentials'
            ]);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        throw new \Exception('Failed to get PayPal access token');
    }

    private function getBaseUrl()
    {
        return $this->mode === 'live'
            ? 'https://api.paypal.com'
            : 'https://api.sandbox.paypal.com';
    }

    public function createOrder(Request $request)
    {
        try {
            $request->validate([
                'booking_public_id' => 'required|exists:volunteer_bookings,public_id'
            ]);

            $booking = VolunteerBooking::with(['project.user'])
                ->where('public_id', $request->booking_public_id)
                ->firstOrFail();

            // Security check
            if ($booking->user_public_id !== $request->user()->public_id) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Calculate amounts
            $fullAmount = $this->calculateTotalAmount(
                $booking->start_date,
                $booking->end_date,
                (float)$booking->project->fees,
                (int)$booking->number_of_travellers
            );

            $depositAmount = $fullAmount * 0.2;

            $accessToken = $this->getAccessToken();

            $orderData = [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => $booking->public_id,
                        'description' => $booking->project->title . ' (20% Deposit)',
                        'custom_id' => $request->user()->public_id,
                        'amount' => [
                            'currency_code' => 'USD',
                            'value' => number_format($depositAmount, 2, '.', ''),
                            'breakdown' => [
                                'item_total' => [
                                    'currency_code' => 'USD',
                                    'value' => number_format($depositAmount, 2, '.', '')
                                ]
                            ]
                        ],
                        'items' => [
                            [
                                'name' => $booking->project->title . ' (20% Deposit)',
                                'description' => 'Deposit for volunteer project booking',
                                'quantity' => '1',
                                'unit_amount' => [
                                    'currency_code' => 'USD',
                                    'value' => number_format($depositAmount, 2, '.', '')
                                ]
                            ]
                        ]
                    ]
                ],
                'application_context' => [
                    'brand_name' => config('app.name'),
                    'landing_page' => 'LOGIN',
                    'user_action' => 'PAY_NOW',
                    'return_url' => route('paypal.success'),
                    'cancel_url' => route('paypal.cancel'),
                    'shipping_preference' => 'NO_SHIPPING'
                ]
            ];

            $response = Http::withToken($accessToken)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Prefer' => 'return=representation'
                ])
                ->post($this->getBaseUrl() . '/v2/checkout/orders', $orderData);

            if ($response->successful()) {
                $order = $response->json();

                // Update booking with calculated amounts
                $booking->update([
                    'total_amount' => $fullAmount,
                    'amount_paid' => $depositAmount
                ]);

                return response()->json([
                    'orderID' => $order['id'],
                    'approveUrl' => collect($order['links'])->firstWhere('rel', 'approve')['href']
                ]);
            }

            throw new \Exception('PayPal order creation failed: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('PayPal create order error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function captureOrder(Request $request)
    {
        try {
            $request->validate([
                'orderID' => 'required'
            ]);

            Log::info('Attempting to capture PayPal order', ['orderID' => $request->orderID]);

            $accessToken = $this->getAccessToken();
            $captureUrl = $this->getBaseUrl() . '/v2/checkout/orders/' . $request->orderID . '/capture';

            // Use withBody method to send proper empty JSON object
            $response = Http::withToken($accessToken)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Prefer' => 'return=representation',
                    'PayPal-Request-Id' => uniqid(), // Add request ID for tracking
                ])
                ->withBody('{}', 'application/json') // Explicitly send empty JSON object
                ->post($captureUrl);

            Log::info('PayPal capture response status', ['status' => $response->status()]);
            Log::info('PayPal capture response body', ['body' => $response->body()]);

            $capture = $response->json();

            if ($response->successful()) {
                if ($capture['status'] === 'COMPLETED') {
                    Log::info('PayPal capture completed successfully', [
                        'order_id' => $request->orderID,
                        'capture_id' => $capture['purchase_units'][0]['payments']['captures'][0]['id'] ?? 'unknown'
                    ]);
                    return $this->handleSuccessfulPayment($capture);
                } else {
                    Log::warning('PayPal capture not completed', [
                        'order_id' => $request->orderID,
                        'status' => $capture['status']
                    ]);
                    return response()->json([
                        'error' => 'Payment status: ' . $capture['status']
                    ], 400);
                }
            }

            // Handle specific PayPal errors
            if (isset($capture['details'])) {
                $errorDetails = collect($capture['details'])
                    ->pluck('description')
                    ->implode(', ');
                Log::error('PayPal capture detailed error', [
                    'details' => $errorDetails,
                    'debug_id' => $capture['debug_id'] ?? 'unknown'
                ]);
                throw new \Exception($errorDetails);
            }

            throw new \Exception($capture['message'] ?? 'Unknown PayPal API error');
        } catch (\Exception $e) {
            Log::error('PayPal capture exception: ' . $e->getMessage());
            return response()->json([
                'error' => 'Payment processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function success(Request $request)
    {
        try {
            $token = $request->query('token');

            if (!$token) {
                return redirect()->route('payment.cancel')
                    ->with('error', 'Payment verification failed.');
            }

            $accessToken = $this->getAccessToken();

            $response = Http::withToken($accessToken)
                ->get($this->getBaseUrl() . '/v2/checkout/orders/' . $token);

            $order = $response->json();

            if ($response->successful() && $order['status'] === 'APPROVED') {
                // Capture the payment
                $captureResponse = Http::withToken($accessToken)
                    ->post($this->getBaseUrl() . '/v2/checkout/orders/' . $token . '/capture');

                $capture = $captureResponse->json();

                if ($captureResponse->successful() && $capture['status'] === 'COMPLETED') {
                    $this->handleSuccessfulPayment($capture);

                    return redirect()->route('volunteer.projects')
                        ->with('success', 'Deposit payment completed successfully!');
                }
            }

            return redirect()->route('payment.cancel')
                ->with('error', 'Payment processing failed.');
        } catch (\Exception $e) {
            Log::error('PayPal success callback error: ' . $e->getMessage());
            return redirect()->route('payment.cancel')
                ->with('error', 'Payment processing error.');
        }
    }

    public function cancel()
    {
        return redirect()->route('volunteer.projects')
            ->with('error', 'Payment was cancelled.');
    }

    private function handleSuccessfulPayment($capture)
    {
        try {
            $purchaseUnit = $capture['purchase_units'][0];
            $payments = $purchaseUnit['payments'];
            $captureData = $payments['captures'][0];

            $bookingPublicId = $purchaseUnit['reference_id'];
            $userPublicId = $purchaseUnit['custom_id'];

            $booking = VolunteerBooking::with(['project.organizationProfile', 'project.user'])
                ->where('public_id', $bookingPublicId)
                ->firstOrFail();

            // Security check
            if ($booking->user_public_id !== $userPublicId) {
                throw new \Exception('Unauthorized access to booking.');
            }

            // Calculate amounts
            $fullAmount = $this->calculateTotalAmount(
                $booking->start_date,
                $booking->end_date,
                (float)$booking->project->fees,
                (int)$booking->number_of_travellers
            );

            $depositAmount = $fullAmount * 0.2;

            // Check if payment already exists
            $existingPayment = Payment::where('paypal_order_id', $capture['id'])->first();
            if ($existingPayment) {
                Log::info('PayPal payment already processed', ['order_id' => $capture['id']]);
                return;
            }

            // Create payment record
            $payment = Payment::create([
                'user_public_id' => $userPublicId,
                'booking_public_id' => $bookingPublicId,
                'project_public_id' => $booking->project_public_id,
                'amount' => $depositAmount,
                'full_amount' => $fullAmount,
                'paypal_order_id' => $capture['id'],
                'paypal_capture_id' => $captureData['id'],
                'status' => 'deposit_paid',
                'payment_type' => 'deposit',
            ]);

            // Update booking
            $booking->update([
                'payment_status' => 'deposit_paid',
                'paid_at' => now(),
                'amount_paid' => $depositAmount,
                'total_amount' => $fullAmount,
            ]);

            // Send notifications
            $this->sendPaymentNotifications($booking, $payment);

            Log::info('PayPal payment processed successfully', [
                'booking_public_id' => $bookingPublicId,
                'order_id' => $capture['id'],
                'capture_id' => $captureData['id']
            ]);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('PayPal handle successful payment error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function handleWebhook(Request $request)
    {
        $webhookBody = $request->getContent();
        $webhookSignature = $request->header('PAYPAL-TRANSMISSION-SIG');
        $webhookId = $request->header('PAYPAL-TRANSMISSION-ID');
        $webhookTimestamp = $request->header('PAYPAL-TRANSMISSION-TIME');
        $certUrl = $request->header('PAYPAL-CERT-URL');

        // Verify webhook signature
        if (!$this->verifyWebhookSignature($webhookBody, $webhookSignature, $webhookId, $webhookTimestamp, $certUrl)) {
            Log::error('PayPal webhook signature verification failed');
            return response()->json(['error' => 'Invalid signature'], 403);
        }

        $event = $request->json()->all();
        Log::info('PayPal webhook received: ' . $event['event_type']);

        switch ($event['event_type']) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                $this->handlePaymentCaptureCompleted($event);
                break;
            case 'PAYMENT.CAPTURE.DENIED':
                $this->handlePaymentCaptureDenied($event);
                break;
            case 'PAYMENT.CAPTURE.REFUNDED':
                $this->handlePaymentCaptureRefunded($event);
                break;
        }

        return response()->json(['success' => true]);
    }

    private function verifyWebhookSignature($webhookBody, $signature, $webhookId, $timestamp, $certUrl)
    {
        // Implement webhook signature verification
        // See: https://developer.payPal.com/docs/api/webhooks/v1/#verify-webhook-signature
        return true; // Implement proper verification in production
    }

    private function handlePaymentCaptureCompleted($event)
    {
        // Handle completed payments via webhook
        $capture = $event['resource'];
        // Similar logic to handleSuccessfulPayment but via webhook
    }

    private function handlePaymentCaptureDenied($event)
    {
        $capture = $event['resource'];
        Log::info('PayPal payment denied: ' . $capture['id']);

        // Update payment status to failed
        Payment::where('paypal_capture_id', $capture['id'])
            ->update(['status' => 'failed']);
    }

    private function handlePaymentCaptureRefunded($event)
    {
        $capture = $event['resource'];

        $payment = Payment::where('paypal_capture_id', $capture['id'])->first();
        if ($payment) {
            $payment->update([
                'status' => 'refunded',
                'refunded_at' => now(),
                'refund_amount' => $capture['amount']['value'],
            ]);

            // Update booking
            $booking = $payment->booking;
            if ($booking) {
                $booking->update([
                    'payment_status' => 'refunded'
                ]);
            }
        }
    }

    protected function sendPaymentNotifications($booking, $payment)
    {
        // Use your existing notification logic
        try {
            $booking = $booking->fresh(['project.organizationProfile', 'project.user', 'user']);

            // Send to paying user
            $booking->user->notifyNow(new PaymentSuccessfulNotification($booking, $payment, 'user'));

            // Send to project owner
            if ($booking->project->user) {
                $booking->project->user->notifyNow(
                    new PaymentSuccessfulNotification($booking, $payment, 'owner')
                );
            }

            // Send to admins
            $admins = Admin::all();
            foreach ($admins as $admin) {
                try {
                    $admin->notifyNow(
                        new PaymentSuccessfulNotification($booking, $payment, 'admin')
                    );
                } catch (\Exception $e) {
                    Log::error('Failed to send notification to admin: ' . $e->getMessage());
                }
            }
        } catch (\Exception $e) {
            Log::error('Failed to send payment notifications: ' . $e->getMessage());
            throw $e;
        }
    }

    protected function calculateTotalAmount($startDate, $endDate, $fees, $travellers)
    {
        $start = new \DateTime($startDate);
        $end = new \DateTime($endDate);
        $diff = $start->diff($end);
        $duration = $diff->days + 1;

        return $duration * (float)$fees * (int)$travellers;
    }
}

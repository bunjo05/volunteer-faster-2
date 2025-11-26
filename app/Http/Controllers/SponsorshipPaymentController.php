<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\VolunteerSponsorship;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Models\Sponsorship as SponsorshipDonation;
use App\Mail\SponsorshipPaymentReceived;

class SponsorshipPaymentController extends Controller
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
                'sponsorship_public_id' => 'required|exists:volunteer_sponsorships,public_id',
                'amount' => 'required|numeric|min:1',
                'is_anonymous' => 'boolean',
                'funding_allocation' => 'nullable|array',
                'custom_amount' => 'nullable|string',
                'include_processing_fee' => 'boolean'
            ]);

            $sponsorship = VolunteerSponsorship::where('public_id', $request->sponsorship_public_id)
                ->with(['user', 'booking.project'])
                ->firstOrFail();

            $amount = $request->amount;

            $accessToken = $this->getAccessToken();

            $orderData = [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => $sponsorship->public_id,
                        'description' => 'Sponsorship for ' . $sponsorship->user->name . ' - ' . $sponsorship->booking->project->title,
                        'custom_id' => json_encode([
                            'sponsorship_public_id' => $sponsorship->public_id,
                            'amount' => $amount,
                            'is_anonymous' => $request->is_anonymous ?? false,
                            'funding_allocation' => $request->funding_allocation,
                            'custom_amount' => $request->custom_amount,
                            'include_processing_fee' => $request->include_processing_fee ?? false
                        ]),
                        'amount' => [
                            'currency_code' => 'USD',
                            'value' => number_format($amount, 2, '.', ''),
                            'breakdown' => [
                                'item_total' => [
                                    'currency_code' => 'USD',
                                    'value' => number_format($amount, 2, '.', '')
                                ]
                            ]
                        ],
                        'items' => [
                            [
                                'name' => 'Volunteer Sponsorship - ' . $sponsorship->user->name,
                                'description' => 'Support volunteer mission: ' . $sponsorship->booking->project->title,
                                'quantity' => '1',
                                'unit_amount' => [
                                    'currency_code' => 'USD',
                                    'value' => number_format($amount, 2, '.', '')
                                ]
                            ]
                        ]
                    ]
                ],
                'application_context' => [
                    'brand_name' => config('app.name'),
                    'landing_page' => 'LOGIN',
                    'user_action' => 'PAY_NOW',
                    'return_url' => route('sponsorship.payment.success'),
                    'cancel_url' => route('sponsorship.payment.cancel'),
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
                return response()->json([
                    'orderID' => $order['id'],
                    'approveUrl' => collect($order['links'])->firstWhere('rel', 'approve')['href']
                ]);
            }

            throw new \Exception('PayPal order creation failed: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('Sponsorship PayPal create order error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function captureOrder(Request $request)
    {
        try {
            $request->validate([
                'orderID' => 'required'
            ]);

            Log::info('Attempting to capture sponsorship PayPal order', ['orderID' => $request->orderID]);

            $accessToken = $this->getAccessToken();
            $captureUrl = $this->getBaseUrl() . '/v2/checkout/orders/' . $request->orderID . '/capture';

            $response = Http::withToken($accessToken)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Prefer' => 'return=representation',
                    'PayPal-Request-Id' => uniqid(),
                ])
                ->withBody('{}', 'application/json')
                ->post($captureUrl);

            Log::info('Sponsorship PayPal capture response status', ['status' => $response->status()]);
            Log::info('Sponsorship PayPal capture response body', ['body' => $response->body()]);

            $capture = $response->json();

            if ($response->successful()) {
                if ($capture['status'] === 'COMPLETED') {
                    Log::info('Sponsorship PayPal capture completed successfully', [
                        'order_id' => $request->orderID,
                        'capture_id' => $capture['purchase_units'][0]['payments']['captures'][0]['id'] ?? 'unknown'
                    ]);
                    return $this->handleSuccessfulSponsorshipPayment($capture);
                } else {
                    Log::warning('Sponsorship PayPal capture not completed', [
                        'order_id' => $request->orderID,
                        'status' => $capture['status']
                    ]);
                    return response()->json([
                        'error' => 'Payment status: ' . $capture['status']
                    ], 400);
                }
            }

            if (isset($capture['details'])) {
                $errorDetails = collect($capture['details'])
                    ->pluck('description')
                    ->implode(', ');
                Log::error('Sponsorship PayPal capture detailed error', [
                    'details' => $errorDetails,
                    'debug_id' => $capture['debug_id'] ?? 'unknown'
                ]);
                throw new \Exception($errorDetails);
            }

            throw new \Exception($capture['message'] ?? 'Unknown PayPal API error');
        } catch (\Exception $e) {
            Log::error('Sponsorship PayPal capture exception: ' . $e->getMessage());
            return response()->json([
                'error' => 'Payment processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    private function handleSuccessfulSponsorshipPayment($capture)
    {
        try {
            $purchaseUnit = $capture['purchase_units'][0];
            $payments = $purchaseUnit['payments'];
            $captureData = $payments['captures'][0];

            $customData = json_decode($purchaseUnit['custom_id'], true);
            $sponsorshipPublicId = $customData['sponsorship_public_id'];
            $processedAmount = $customData['amount'];
            $isAnonymous = $customData['is_anonymous'] ?? false;
            $fundingAllocation = $customData['funding_allocation'] ?? null;
            $customAmount = $customData['custom_amount'] ?? null;
            $includeProcessingFee = $customData['include_processing_fee'] ?? false;

            $sponsorship = VolunteerSponsorship::with(['user', 'booking.project'])
                ->where('public_id', $sponsorshipPublicId)
                ->first();

            if (!$sponsorship) {
                throw new \Exception('Sponsorship not found');
            }

            // Check if payment already exists
            $existingPayment = SponsorshipDonation::where('paypal_order_id', $capture['id'])->first();
            if ($existingPayment) {
                Log::info('Sponsorship PayPal payment already processed', ['order_id' => $capture['id']]);
                return response()->json(['success' => true]);
            }

            // Calculate the stored amount (6% less than processed amount)
            $storedAmount = $this->calculateStoredAmount($processedAmount, $includeProcessingFee);

            // Generate ULID for public_id
            $publicId = (string) \Illuminate\Support\Str::ulid();

            // Create sponsorship donation record with stored amount (6% less)
            $sponsorshipDonation = SponsorshipDonation::create([
                'public_id' => $publicId,
                'user_public_id' => Auth::check() ? Auth::user()->public_id : null,
                'booking_public_id' => $sponsorship->booking_public_id,
                'sponsorship_public_id' => $sponsorship->public_id,
                'amount' => $storedAmount, // Store the amount after 6% deduction
                'processed_amount' => $processedAmount, // Store the original processed amount for reference
                'funding_allocation' => $fundingAllocation,
                'paypal_order_id' => $capture['id'],
                'paypal_capture_id' => $captureData['id'],
                'status' => 'completed',
                'payment_method' => 'paypal',
                'is_anonymous' => $isAnonymous,
                'include_processing_fee' => $includeProcessingFee,
            ]);

            Log::info('Sponsorship PayPal payment processed successfully', [
                'sponsorship_public_id' => $sponsorshipPublicId,
                'processed_amount' => $processedAmount,
                'stored_amount' => $storedAmount,
                'order_id' => $capture['id'],
                'capture_id' => $captureData['id'],
                'donation_public_id' => $publicId,
                'include_processing_fee' => $includeProcessingFee
            ]);

            // Send email notifications
            $this->sendPaymentNotifications($sponsorship, $sponsorshipDonation);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Sponsorship handle successful payment error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Calculate the amount to be stored in database (6% less than processed amount)
     *
     * @param float $processedAmount The original amount processed through PayPal
     * @param bool $includeProcessingFee Whether processing fee was included in the payment
     * @return float
     */
    private function calculateStoredAmount($processedAmount, $includeProcessingFee)
    {
        if ($includeProcessingFee) {
            // If processing fee was included, the base amount is 94.34% of processed amount
            // because: baseAmount + (baseAmount * 0.06) = processedAmount
            // baseAmount * 1.06 = processedAmount
            // baseAmount = processedAmount / 1.06
            $baseAmount = $processedAmount / 1.06;

            // Store the base amount (which is effectively 6% less than the total processed amount)
            return round($baseAmount, 2);
        } else {
            // If processing fee was not included, simply deduct 6% from processed amount
            return round($processedAmount * 0.94, 2);
        }
    }

    private function sendPaymentNotifications($sponsorship, $sponsorshipDonation)
    {
        try {
            // Send notification to the sponsorship owner (volunteer)
            if ($sponsorship->user && $sponsorship->user->email) {
                Mail::to($sponsorship->user->email)
                    ->send(new SponsorshipPaymentReceived($sponsorship, $sponsorshipDonation, 'volunteer'));

                Log::info('Sponsorship payment notification sent to volunteer', [
                    'volunteer_email' => $sponsorship->user->email,
                    'sponsorship_id' => $sponsorship->public_id,
                    'processed_amount' => $sponsorshipDonation->processed_amount,
                    'stored_amount' => $sponsorshipDonation->amount
                ]);
            }

            // Send notification to the donor (if not anonymous and user is logged in)
            if (!$sponsorshipDonation->is_anonymous && $sponsorshipDonation->user_public_id) {
                $donor = \App\Models\User::where('public_id', $sponsorshipDonation->user_public_id)->first();
                if ($donor && $donor->email) {
                    Mail::to($donor->email)
                        ->send(new SponsorshipPaymentReceived($sponsorship, $sponsorshipDonation, 'donor'));

                    Log::info('Sponsorship payment confirmation sent to donor', [
                        'donor_email' => $donor->email,
                        'sponsorship_id' => $sponsorship->public_id,
                        'processed_amount' => $sponsorshipDonation->processed_amount,
                        'stored_amount' => $sponsorshipDonation->amount
                    ]);
                }
            }

            // Send notification to admin (optional)
            // $admins = \App\Models\Admin::all();
            // foreach ($admins as $admin) {
            //     Mail::to($admin->email)
            //         ->send(new SponsorshipPaymentReceived($sponsorship, $sponsorshipDonation, 'admin'));
            // }

        } catch (\Exception $e) {
            Log::error('Failed to send sponsorship payment notifications: ' . $e->getMessage());
            // Don't throw the error - we don't want to fail the payment if email fails
        }
    }

    public function success(Request $request)
    {
        return redirect()->route('volunteer.guest.sponsorship.page.with.volunteer', $request->sponsorship_public_id)
            ->with('success', 'Sponsorship payment completed successfully!');
    }

    public function cancel()
    {
        return redirect()->back()
            ->with('error', 'Sponsorship payment was cancelled.');
    }
}

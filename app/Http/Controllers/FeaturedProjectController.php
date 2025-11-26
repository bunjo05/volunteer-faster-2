<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Stripe\Webhook;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Project;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use App\Models\FeaturedProject;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewFeatureRequestNotification;
use App\Mail\ProjectFeatureRequestReceived;

class FeaturedProjectController extends Controller
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

    // PayPal order creation for featured projects
    public function createPayPalOrder(Request $request)
    {
        try {
            Log::info('Starting PayPal featured project order creation', $request->all());

            $request->validate([
                'project_public_id' => 'required|exists:projects,public_id',
                'plan_type' => 'required|in:1_month,3_months,6_months,1_year',
            ]);

            $project = Project::where('public_id', $request->project_public_id)->firstOrFail();
            $user = Auth::user();

            // Security check
            if ($project->user_public_id !== $user->public_id) {
                return response()->json([
                    'error' => 'You do not own this project',
                    'code' => 'FORBIDDEN'
                ], 403);
            }

            $pricingPlans = [
                '1_month' => ['price' => 50.00, 'duration_days' => 30],
                '3_months' => ['price' => 120.00, 'duration_days' => 90],
                '6_months' => ['price' => 200.00, 'duration_days' => 180],
                '1_year' => ['price' => 350.00, 'duration_days' => 365],
            ];

            if (!array_key_exists($request->plan_type, $pricingPlans)) {
                return response()->json([
                    'error' => 'Invalid plan type',
                    'code' => 'INVALID_PLAN'
                ], 400);
            }

            $selectedPlan = $pricingPlans[$request->plan_type];
            $amount = $selectedPlan['price'];

            $accessToken = $this->getAccessToken();

            $orderData = [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => $project->public_id,
                        'description' => "Featured Project: {$project->title} ({$request->plan_type})",
                        'custom_id' => $user->public_id,
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
                                'name' => "Featured Project: {$project->title} ({$request->plan_type})",
                                'description' => 'Featured project listing payment',
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
                    'return_url' => route('paypal.featured.success'),
                    'cancel_url' => route('paypal.featured.cancel'),
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

                // Store order details temporarily in session
                session([
                    'paypal_featured_order' => [
                        'order_id' => $order['id'],
                        'project_public_id' => $project->public_id,
                        'user_public_id' => $user->public_id,
                        'plan_type' => $request->plan_type,
                        'amount' => $amount,
                        'duration_days' => $selectedPlan['duration_days'],
                    ]
                ]);

                return response()->json([
                    'orderID' => $order['id'],
                    'status' => $order['status']
                ]);
            }

            throw new \Exception('PayPal order creation failed: ' . $response->body());
        } catch (\Exception $e) {
            Log::error('PayPal featured project order creation error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'code' => 'PAYPAL_ERROR'
            ], 500);
        }
    }

    // Capture PayPal payment for featured projects
    public function capturePayPalOrder(Request $request)
    {
        try {
            Log::info('Attempting to capture PayPal featured project order', ['orderID' => $request->orderID]);

            $request->validate([
                'orderID' => 'required'
            ]);

            $accessToken = $this->getAccessToken();
            $captureUrl = $this->getBaseUrl() . '/v2/checkout/orders/' . $request->orderID . '/capture';

            // Use withBody method to send proper empty JSON object
            $response = Http::withToken($accessToken)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Prefer' => 'return=representation',
                    'PayPal-Request-Id' => uniqid(),
                ])
                ->withBody('{}', 'application/json')
                ->post($captureUrl);

            Log::info('PayPal featured project capture response status', ['status' => $response->status()]);
            Log::info('PayPal featured project capture response body', ['body' => $response->body()]);

            $capture = $response->json();

            if ($response->successful()) {
                if ($capture['status'] === 'COMPLETED') {
                    Log::info('PayPal featured project capture completed successfully', [
                        'order_id' => $request->orderID,
                        'capture_id' => $capture['purchase_units'][0]['payments']['captures'][0]['id'] ?? 'unknown'
                    ]);
                    return $this->handleSuccessfulFeaturedProjectPayment($capture);
                } else {
                    Log::warning('PayPal featured project capture not completed', [
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
                Log::error('PayPal featured project capture detailed error', [
                    'details' => $errorDetails,
                    'debug_id' => $capture['debug_id'] ?? 'unknown'
                ]);
                throw new \Exception($errorDetails);
            }

            throw new \Exception($capture['message'] ?? 'Unknown PayPal API error');
        } catch (\Exception $e) {
            Log::error('PayPal featured project capture exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Payment processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    private function handleSuccessfulFeaturedProjectPayment($capture)
    {
        try {
            $purchaseUnit = $capture['purchase_units'][0];
            $payments = $purchaseUnit['payments'];
            $captureData = $payments['captures'][0];

            $projectPublicId = $purchaseUnit['reference_id'];
            $userPublicId = $purchaseUnit['custom_id'];

            $project = Project::where('public_id', $projectPublicId)->firstOrFail();
            $user = Auth::user();

            // Security check
            if ($project->user_public_id !== $userPublicId) {
                throw new \Exception('Unauthorized access to project.');
            }

            // Get stored order details from session
            $storedOrder = session('paypal_featured_order');

            if (!$storedOrder || $storedOrder['order_id'] !== $capture['id']) {
                throw new \Exception('Invalid order session');
            }

            // Check if featured project already exists for this order
            $existingFeaturedProject = FeaturedProject::where('paypal_order_id', $capture['id'])->first();
            if ($existingFeaturedProject) {
                Log::info('PayPal featured project payment already processed', ['order_id' => $capture['id']]);
                return response()->json(['success' => true]);
            }

            // Create featured project record
            $featuredProject = FeaturedProject::create([
                'project_public_id' => $projectPublicId,
                'user_public_id' => $userPublicId,
                'plan_type' => $storedOrder['plan_type'],
                'amount' => $storedOrder['amount'],
                'paypal_order_id' => $capture['id'],
                'paypal_capture_id' => $captureData['id'],
                'status' => 'pending',
                'is_active' => false,
            ]);

            // Send email to project owner
            Mail::to($project->user->email)
                ->send(new ProjectFeatureRequestReceived($project));

            // Send email to all admins
            $admins = Admin::all();
            foreach ($admins as $admin) {
                Mail::to($admin->email)
                    ->send(new NewFeatureRequestNotification($project, $featuredProject));
            }

            // Clear session
            session()->forget('paypal_featured_order');

            Log::info('PayPal featured project payment processed successfully', [
                'project_public_id' => $projectPublicId,
                'order_id' => $capture['id'],
                'capture_id' => $captureData['id']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment completed successfully! Your project will be featured after admin approval.'
            ]);
        } catch (\Exception $e) {
            Log::error('PayPal handle successful featured project payment error: ' . $e->getMessage());
            throw $e;
        }
    }

    // PayPal success route for featured projects
    public function paypalSuccess(Request $request)
    {
        try {
            $token = $request->query('token');

            if (!$token) {
                return redirect()->route('organization.projects')
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
                    $this->handleSuccessfulFeaturedProjectPayment($capture);

                    return redirect()->route('organization.projects')
                        ->with('success', 'Payment completed successfully! Your project will be featured after admin approval.');
                }
            }

            return redirect()->route('organization.projects')
                ->with('error', 'Payment processing failed.');
        } catch (\Exception $e) {
            Log::error('PayPal featured project success callback error: ' . $e->getMessage());
            return redirect()->route('organization.projects')
                ->with('error', 'Payment processing error.');
        }
    }

    // PayPal cancel route for featured projects
    public function paypalCancel(Request $request)
    {
        // Clear any stored session data
        session()->forget('paypal_featured_order');

        return redirect()->route('organization.projects')
            ->with('error', 'Payment was cancelled.');
    }

    // Keep existing Stripe methods for backward compatibility
    public function checkout(Request $request)
    {
        try {
            $request->validate([
                'project_public_id' => 'required|exists:projects,public_id',
                'plan_type' => 'required|in:1_month,3_months,6_months,1_year',
            ]);

            $project = Project::where('public_id', $request->project_public_id)->firstOrFail();
            $user = Auth::user();

            if ($project->user_public_id !== $user->public_id) {
                return response()->json([
                    'error' => 'You do not own this project',
                    'code' => 'FORBIDDEN'
                ], 403);
            }

            $pricingPlans = [
                '1_month' => ['price' => 50.00, 'duration_days' => 30],
                '3_months' => ['price' => 120.00, 'duration_days' => 90],
                '6_months' => ['price' => 200.00, 'duration_days' => 180],
                '1_year' => ['price' => 350.00, 'duration_days' => 365],
            ];

            if (!array_key_exists($request->plan_type, $pricingPlans)) {
                return response()->json([
                    'error' => 'Invalid plan type',
                    'code' => 'INVALID_PLAN'
                ], 400);
            }

            $selectedPlan = $pricingPlans[$request->plan_type];
            $amount = $selectedPlan['price'];

            Stripe::setApiKey(config('services.stripe.secret'));

            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => "Featured Project: {$project->title} ({$request->plan_type})",
                        ],
                        'unit_amount' => $amount * 100,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => route('featured.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('featured.cancel'),
                'metadata' => [
                    'project_public_id' => $project->public_id,
                    'user_public_id' => $user->public_id,
                    'plan_type' => $request->plan_type,
                    'amount' => $amount,
                    'duration_days' => $selectedPlan['duration_days'],
                ],
            ]);

            return response()->json([
                'sessionId' => $session->id,
                'publishableKey' => config('services.stripe.key')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'code' => 'STRIPE_ERROR'
            ], 500);
        }
    }

    public function success(Request $request)
    {
        $sessionId = $request->get('session_id');

        Stripe::setApiKey(config('services.stripe.secret'));
        $session = Session::retrieve($sessionId);

        if ($session->payment_status === 'paid') {
            $projectPublicId = $session->metadata->project_public_id;
            $userPublicId = $session->metadata->user_public_id;
            $planType = $session->metadata->plan_type;
            $amount = $session->metadata->amount;
            $durationDays = $session->metadata->duration_days;

            $project = Project::where('public_id', $projectPublicId)->first();

            if ($project) {
                FeaturedProject::create([
                    'project_public_id' => $projectPublicId,
                    'user_public_id' => $userPublicId,
                    'plan_type' => $planType,
                    'amount' => $amount,
                    'stripe_payment_id' => $session->payment_intent,
                    'status' => 'pending',
                    'is_active' => false,
                ]);

                Mail::to($project->user->email)
                    ->send(new ProjectFeatureRequestReceived($project));

                $admins = Admin::all();
                foreach ($admins as $admin) {
                    Mail::to($admin->email)
                        ->send(new NewFeatureRequestNotification($project));
                }

                return redirect()->route('organization.projects')
                    ->with('success', 'Payment successful! Your project will be featured after admin approval.');
            }
        }

        return redirect()->route('featured.cancel');
    }

    public function cancel()
    {
        return redirect()->back()->with('error', 'Payment was cancelled.');
    }

    // Admin approval methods
    public function approveFeaturedProject(Request $request, $id)
    {
        $featuredProject = FeaturedProject::findOrFail($id);

        $durationDays = [
            '1_month' => 30,
            '3_months' => 90,
            '6_months' => 180,
            '1_year' => 365,
        ][$featuredProject->plan_type];

        $featuredProject->update([
            'status' => 'approved',
            'is_active' => true,
            'start_date' => now(),
            'end_date' => now()->addDays($durationDays),
        ]);

        return redirect()->back()->with('success', 'Featured project approved successfully.');
    }

    public function rejectFeaturedProject(Request $request, $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:255',
        ]);

        $featuredProject = FeaturedProject::findOrFail($id);
        $featuredProject->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'is_active' => false,
        ]);

        return redirect()->back()->with('success', 'Featured project rejected successfully.');
    }

    public function featuredProjects()
    {
        FeaturedProject::where('is_active', true)
            ->whereNotNull('end_date')
            ->where('end_date', '<', now())
            ->update(['is_active' => false]);

        $featuredProjects = FeaturedProject::with(['project', 'user'])
            ->latest()
            ->get()
            ->map(function ($project) {
                $project->amount = (float)$project->amount;
                return $project;
            });

        return inertia('Admins/Projects/FeaturedProject', [
            'featuredProjects' => $featuredProjects,
        ]);
    }
}

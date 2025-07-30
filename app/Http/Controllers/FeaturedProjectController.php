<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Stripe\Webhook;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use App\Models\FeaturedProject;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class FeaturedProjectController extends Controller
{
    public function showFeatureModal($projectId)
    {
        $project = Project::findOrFail($projectId);

        return Inertia::render('Projects/FeatureModal', [
            'project' => $project,
            'pricingPlans' => [
                '1_month' => [
                    'price' => 50.00,
                    'label' => '1 Month Featured',
                    'duration_days' => 30,
                ],
                '3_months' => [
                    'price' => 120.00,
                    'label' => '3 Months Featured',
                    'duration_days' => 90,
                ],
                '6_months' => [
                    'price' => 200.00,
                    'label' => '6 Months Featured',
                    'duration_days' => 180,
                ],
                '1_year' => [
                    'price' => 350.00,
                    'label' => '1 Year Featured',
                    'duration_days' => 365,
                ],
            ]
        ]);
    }

    public function checkout(Request $request)
    {
        try {
            $request->validate([
                'project_id' => 'required|exists:projects,id',
                'plan_type' => 'required|in:1_month,3_months,6_months,1_year',
            ]);

            $project = Project::findOrFail($request->project_id);
            $user = Auth::user();

            if ($project->user_id !== $user->id) {
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
                    'project_id' => $project->id,
                    'user_id' => $user->id,
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
            $projectId = $session->metadata->project_id;
            $userId = $session->metadata->user_id;
            $planType = $session->metadata->plan_type;
            $amount = $session->metadata->amount;
            $durationDays = $session->metadata->duration_days;

            // Create featured project record (status will be pending until admin approves)
            FeaturedProject::create([
                'project_id' => $projectId,
                'user_id' => $userId,
                'plan_type' => $planType,
                'amount' => $amount,
                'stripe_payment_id' => $session->payment_intent,
                'status' => 'pending',
                'is_active' => false,
            ]);

            return redirect()->route('projects.home.view', ['slug' => Project::find($projectId)->slug])
                ->with('success', 'Payment successful! Your project will be featured after admin approval.');
        }

        return redirect()->route('featured.cancel');
    }

    public function cancel()
    {
        return redirect()->back()->with('error', 'Payment was cancelled.');
    }

    // public function showFeatureModal($projectId)
    // {
    //     $project = Project::findOrFail($projectId);

    //     return Inertia::render('Projects/Index', [
    //         'project' => $project,
    //         'pricingPlans' => [
    //             '1_month' => [
    //                 'price' => 50.00,
    //                 'label' => '1 Month Featured',
    //                 'duration_days' => 30,
    //             ],
    //             '3_months' => [
    //                 'price' => 120.00,
    //                 'label' => '3 Months Featured',
    //                 'duration_days' => 90,
    //             ],
    //             '6_months' => [
    //                 'price' => 200.00,
    //                 'label' => '6 Months Featured',
    //                 'duration_days' => 180,
    //             ],
    //             '1_year' => [
    //                 'price' => 350.00,
    //                 'label' => '1 Year Featured',
    //                 'duration_days' => 365,
    //             ],
    //         ],
    //         'stripeKey' => config('services.stripe.key'),
    //     ]);
    // }

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
        } catch (\Exception $e) {
            Log::error('Stripe webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid payload'], 400);
        }

        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $this->handleCheckoutSessionCompleted($session);
                break;
        }

        return response()->json(['success' => true]);
    }

    protected function handleCheckoutSessionCompleted($session)
    {
        if ($session->payment_status === 'paid') {
            $projectId = $session->metadata->project_id;
            $userId = $session->metadata->user_id;
            $planType = $session->metadata->plan_type;
            $amount = $session->metadata->amount;
            $durationDays = $session->metadata->duration_days;

            // Create featured project record (status will be pending until admin approves)
            FeaturedProject::create([
                'project_id' => $projectId,
                'user_id' => $userId,
                'plan_type' => $planType,
                'amount' => $amount,
                'stripe_payment_id' => $session->payment_intent,
                'status' => 'pending',
                'is_active' => false,
            ]);
        }
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

    // In your FeaturedProjectController
    public function featuredProjects()
    {
        // First, update any expired featured projects
        FeaturedProject::where('is_active', true)
            ->whereNotNull('end_date')
            ->where('end_date', '<', now())
            ->update(['is_active' => false]);

        $featuredProjects = FeaturedProject::with(['project', 'user'])
            ->latest()
            ->get()
            ->map(function ($project) {
                // Ensure amount is cast to float
                $project->amount = (float)$project->amount;
                return $project;
            });

        return inertia('Admins/Projects/FeaturedProject', [
            'featuredProjects' => $featuredProjects,
        ]);
    }
}

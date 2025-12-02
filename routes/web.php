<?php

use Inertia\Inertia;
use App\Models\Payment;
use App\Models\VolunteerBooking;
use App\Mail\PaymentSuccessfulUser;
use App\Mail\PaymentSuccessfulOwner;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Request;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminsController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SponsorController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\PayPalPaymentController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\VolunteerFeedController;
use App\Http\Controllers\Admin\ReferralController;
use App\Http\Controllers\FeaturedProjectController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\VolunteerFollowOrganization;
use App\Http\Controllers\SponsorshipPaymentController;
use App\Http\Controllers\Auth\OtpVerificationController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// API Routes
Route::get('/api/check-volunteer-profile', function () {
    $user = Auth::user();

    if (!$user) {
        return response()->json(['hasProfile' => false]);
    }

    $hasProfile = $user->volunteerProfile()->exists();
    return response()->json([
        'hasProfile' => $hasProfile,
        'profile' => $hasProfile ? $user->volunteerProfile : null
    ]);
})->middleware('auth');

// Static Routes - Most Specific First
Route::get('/', [HomeController::class, 'index'])->name('home');

// Legal and informational pages
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/about-us', function () {
    return inertia('About');
})->name('about');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::get('/contact-us', [HomeController::class, 'contactUs'])->name('contact');
Route::post('/contact-us', [HomeController::class, 'storeContactMessage'])->name('contact.store');
Route::get('/privacy-policy', [HomeController::class, 'privacyPolicy'])->name('privacy.policy');
Route::get('/terms-and-conditions', [HomeController::class, 'termsAndConditions'])->name('terms.conditions');
Route::get('/faq', [HomeController::class, 'faq'])->name('faq');
Route::get('/volunteer-guide', function () {
    return inertia('Guide');
})->name('guide');
Route::get('/gdpr', function () {
    return inertia('GDPR');
})->name('gdpr');
Route::get('/cookies', function () {
    return inertia('Cookies');
})->name('cookies');

// Main section routes
Route::get('/volunteer', [HomeController::class, 'volunteer'])->name('volunteer');
Route::get('/organization', [HomeController::class, 'organization'])->name('organization');
Route::get('/volunteer-feed', [VolunteerFeedController::class, 'index'])->name('volunteer.feed.index');
Route::get('/corporate-impact-sponsorship', [HomeController::class, 'sponsorshipPage'])->name('guest.sponsorship.page');

// Volunteer programs routes
Route::get('/volunteer-programs', [HomeController::class, 'projects'])->name('projects');
Route::get('/volunteer-programs/{slug}', [HomeController::class, 'viewProject'])->name('projects.home.view');
Route::get('/volunteer-programs/{slug}/volunteer', [BookingController::class, 'index'])->name('project.volunteer.booking');
// Route::get('/volunteer-programs/{slug}/{organization_profile}', [HomeController::class, 'OrganizationProfile'])
//     ->name('home.organization.profile');
// Route::get('/projects/{project_slug}/organization/{organization_slug}', [HomeController::class, 'OrganizationProfile'])
//     ->name('home.organization.profile');

// Booking and verification routes
Route::post('/send-verification-code', [BookingController::class, 'volunteerEmailSend'])->name('volunteer.email.send');
Route::post('/check-email-exists', [BookingController::class, 'checkEmailExists'])->name('volunteer.email.exists');
Route::post('/volunteer/email/verify', [BookingController::class, 'verify'])->name('volunteer.email.verify');
Route::post('/volunteer-booking/store', [BookingController::class, 'store'])->name('volunteer.booking.store');
Route::post('/auth/volunteer-booking/store', [BookingController::class, 'authStore'])->name('auth.volunteer.booking.store');

// Sponsorship routes
Route::get('/corporate-impact-sponsorship/{sponsorship_public_id}', [HomeController::class, 'sponsorshipPageIndividual'])->name('volunteer.guest.sponsorship.page.with.volunteer');
Route::post('/sponsorship/paypal/create-order', [SponsorshipPaymentController::class, 'createOrder']);
Route::post('/sponsorship/paypal/capture-order', [SponsorshipPaymentController::class, 'captureOrder']);
Route::get('/sponsorship/payment/success', [SponsorshipPaymentController::class, 'success'])->name('sponsorship.payment.success');
Route::get('/sponsorship/payment/cancel', [SponsorshipPaymentController::class, 'cancel'])->name('sponsorship.payment.cancel');

// Project reporting
Route::post('/volunteer-programs/report', [VolunteerController::class, 'storeProjectReport'])->name('project.report.store');

// Certificate verification
Route::get('/certificate/verify/{public_id}/{hash}', [HomeController::class, 'verifyCertificate'])
    ->name('certificate.verify');

// Authentication routes
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('google.login');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

Route::get('/verify-otp', [OtpVerificationController::class, 'show'])->name('otp.verify');
Route::post('/verify-otp', [OtpVerificationController::class, 'store'])->name('otp.verify.store');
Route::post('/otp/resend', [AuthenticatedSessionController::class, 'resend'])->name('otp.resend');

// Dashboard route
Route::get('/dashboard', function () {
    $user = Auth::user();

    if (!$user) {
        return redirect('/login');
    }

    // Redirect based on user role
    switch ($user->role) {
        case "Organization":
            return redirect()->route('organization.dashboard');
        case "Volunteer":
            return redirect()->route('volunteer.dashboard');
        case 'Sponsor':
            return redirect()->route('sponsor.dashboard');
        default:
            return Inertia::render('Dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

// Authenticated user routes
Route::middleware('auth')->group(function () {
    Route::post('/project-remark-comments', [HomeController::class, 'storeReviews'])
        ->name('project.remark.comments.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Sponsor Routes
Route::prefix('sponsor')->middleware(['check.role:Sponsor', 'auth'])->group(function () {
    Route::get('/dashboard', [SponsorController::class, 'dashboard'])->name('sponsor.dashboard');
});

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login'])->name('admin.login');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

// Admin Dashboard Routes
Route::prefix('admin')->middleware('auth:admin')->group(function () {
    Route::get('/dashboard', [AdminsController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [AdminsController::class, 'users'])->name('admin.users');
    Route::put('/users/{user}/status', [AdminsController::class, 'updateStatus']);
    Route::put('/project/{id}/status', [AdminsController::class, 'updateProjectStatus'])->name('admin.project.update-status');
    Route::post('/project/remark', [AdminsController::class, 'storeRemark'])->name('admin.project.remark.store');
    Route::put('/admin/project-remark/{id}', [AdminsController::class, 'updateRemark'])->name('admin.project.remark.update');

    Route::get('/organizations', [AdminsController::class, 'organizations'])->name('admin.organizations');
    Route::get('/organizations/{slug}', [AdminsController::class, 'viewOrganization'])->name('admin.organizations.view');
    Route::get('/organizations/{slug}/verifications', [AdminsController::class, 'organizationVerifications'])->name('admin.organizations.verifications');
    Route::post('/organizations/{slug}/verifications/{verification_id}', [AdminsController::class, 'updateVerification'])
        ->name('admin.organizations.verification.update');

    Route::get('/volunteers/{volunteer}/verifications', [AdminsController::class, 'volunteerVerifications'])->name('admin.volunteers.verifications');
    Route::post('/volunteers/{volunteer}/verifications/{verification}', [AdminsController::class, 'updateVolunteerVerification'])->name('admin.volunteers.verification.update');
    Route::get('/volunteers', [AdminsController::class, 'volunteers'])->name('admin.volunteers');
    Route::get('/projects', [AdminsController::class, 'projects'])->name('admin.projects');
    Route::get('/projects/{slug}', [AdminsController::class, 'viewProject'])->name('admin.projects.view');
    Route::get('/messages', [AdminsController::class, 'messages'])->name('admin.messages');

    Route::get('/categories', [AdminsController::class, 'categories'])->name('admin.categories');
    Route::post('/categories', [AdminsController::class, 'storeCategory'])->name('admin.categories.store');
    Route::get('/subcategories', [AdminsController::class, 'subcategories'])->name('admin.subcategories');
    Route::post('/subcategories', [AdminsController::class, 'storeSubcategory'])->name('admin.subcategories.store');

    // Report Categories
    Route::get('/report/report-categories', [AdminsController::class, 'reportCategories'])
        ->name('admin.report-categories');
    Route::get('/report/report-categories/create', [AdminsController::class, 'createReportCategory'])
        ->name('admin.report-categories.create');
    Route::post('/report/report-categories', [AdminsController::class, 'storeReportCategory'])
        ->name('admin.report-categories.store');
    Route::get('/report/report-categories/{reportCategory}/edit', [AdminsController::class, 'editReportCategory'])
        ->name('admin.report-categories.edit');
    Route::put('/report/report-categories/{reportCategory}', [AdminsController::class, 'updateReportCategory'])
        ->name('admin.report-categories.update');
    Route::delete('/report/report-categories/{reportCategory}', [AdminsController::class, 'destroyReportCategory'])
        ->name('admin.report-categories.destroy');

    // Report Subcategories
    Route::get('/report/report-subcategories', [AdminsController::class, 'reportSubcategories'])
        ->name('admin.report-subcategories.index');
    Route::get('/report/report-subcategories/create', [AdminsController::class, 'createReportSubcategory'])
        ->name('admin.report-subcategories.create');
    Route::post('/report/report-subcategories', [AdminsController::class, 'storeReportSubcategory'])
        ->name('admin.report-subcategories.store');
    Route::get('/report/report-subcategories/{reportSubcategory}/edit', [AdminsController::class, 'editReportSubcategory'])
        ->name('admin.report-subcategories.edit');
    Route::put('/report/report-subcategories/{reportSubcategory}', [AdminsController::class, 'updateReportSubcategory'])
        ->name('admin.report-subcategories.update');
    Route::delete('/report/report-subcategories/{reportSubcategory}', [AdminsController::class, 'destroyReportSubcategory'])
        ->name('admin.report-subcategories.destroy');

    Route::get('/project/reports', [AdminsController::class, 'projectReports'])
        ->name('admin.project.reports');

    Route::prefix('chats')->group(function () {
        Route::get('/', [ChatController::class, 'AdminIndex'])->name('chat.index');
        Route::post('/{chat}/messages', [ChatController::class, 'AdminStore'])->name('admin.chat.store');
        Route::post('/{chat}', [ChatController::class, 'AdminStore'])->name('admin.chats.store');
        Route::post('/{chat}/read', [ChatController::class, 'AdminMarkAsRead'])->name('admin.chats.markAsRead');
        Route::post('/{chat}/accept', [ChatController::class, 'AdminAcceptChat'])->name('admin.chat.accept');
        Route::post('/{chat}/end', [ChatController::class, 'endChat'])->name('admin.chats.end');
        Route::get('/list', [ChatController::class, 'volunteerChatList']);
    });

    Route::get('/payments', [AdminsController::class, 'payments'])->name('admin.payments');

    // Featured Projects
    Route::get('/featured-projects', [AdminsController::class, 'featuredProjects'])->name('admin.featured.projects');
    Route::put('/featured-projects/{slug}/status', [AdminsController::class, 'updateFeaturedProjectStatus'])
        ->name('admin.featured-projects.update-status');

    Route::get('/contacts', [AdminsController::class, 'adminChatIndex'])->name('admin.contacts.index');
    Route::get('/contacts/{contact}', [AdminsController::class, 'adminShow'])->name('admin.contacts.show');
    Route::post('/contacts/{contact}/reply', [AdminsController::class, 'adminReply'])->name('admin.contacts.reply');

    Route::put('/contacts/{contact}/status', [AdminsController::class, 'updateContactStatus']);

    // Referral
    Route::get('/referrals', [AdminsController::class, 'userReferral'])->name('admin.referrals.index');
    Route::post('/referrals/{referral}/approve', [AdminsController::class, 'approve'])->name('admin.referrals.approve');
    Route::post('/referrals/{referral}/reject', [AdminsController::class, 'reject'])->name('admin.referrals.reject');

    Route::get('/reviews', [AdminsController::class, 'Reviews'])
        ->name('admin.reviews');
    Route::put('/reviews/{review}/status', [AdminsController::class, 'updateReviewStatus'])
        ->name('admin.reviews.update-status');

    Route::get('/platform-reviews', [AdminsController::class, 'platformReview'])->name('admin.platform.reviews');
    Route::post('/platform-reviews/{review}/status', [AdminsController::class, 'updatePlatformStatus'])->name('admin.platform-reviews.update-status');

    Route::get('/sponsors', [AdminsController::class, 'sponsorIndex'])->name('admin.sponsor.index');
    Route::post('/sponsors/{id}/status', [AdminsController::class, 'updateSponsorStatus'])->name('admin.sponsors.updateStatus');
    Route::delete('/sponsors/{id}', [AdminsController::class, 'destroySponsor'])->name('admin.sponsors.destroy');
});

// Volunteer Routes
Route::prefix('volunteer')->middleware(['check.role:Volunteer', 'auth'])->group(function () {
    Route::get('/dashboard', [VolunteerController::class, 'index'])->name('volunteer.dashboard');
    Route::get('/messages', [VolunteerController::class, 'messages'])->name('volunteer.messages');
    Route::patch('/messages/mark-all-read/{senderId}', [VolunteerController::class, 'markAllRead'])
        ->name('volunteer.messages.mark-all-read');
    Route::post('/messages', [VolunteerController::class, 'storeMessage'])
        ->name('volunteer.messages.store');
    Route::get('/project', [VolunteerController::class, 'projects'])->name('volunteer.projects');
    Route::post('/send-reminder/{bookingId}', [VolunteerController::class, 'sendReminder'])
        ->name('volunteer.send-reminder');

    Route::get('/messages/unread-count', [VolunteerController::class, 'getUnreadMessageCount'])
        ->name('volunteer.messages.unread-count');

    Route::get('/points', [VolunteerController::class, 'points'])->name('volunteer.points');
    Route::post('/bookings/{booking}/pay-with-points', [VolunteerController::class, 'payWithPoints'])
        ->name('volunteer.pay-with-points');
    Route::get('/profile', [VolunteerController::class, 'profile'])->name('volunteer.profile');
    Route::post('/profile', [VolunteerController::class, 'updateProfile'])->name('volunteer.profile.update');
    Route::get('/{volunteer}/verification', [VolunteerController::class, 'verification'])
        ->name('volunteer.verification');
    Route::post('/{volunteer}/verification', [VolunteerController::class, 'storeVerification'])
        ->name('volunteer.verification.store');
    Route::post('/reviews', [VolunteerController::class, 'storeReview'])
        ->name('volunteer.reviews.stores');
    Route::post('/platform/reviews', [VolunteerController::class, 'platformReview'])->name('platform.review');

    Route::get('/contact-requests', [VolunteerController::class, 'getContactRequests'])
        ->name('volunteer.contact.requests');
    Route::post('/contact-requests/{requestId}/respond', [VolunteerController::class, 'respondToContactRequest'])
        ->name('volunteer.contact.respond');

    Route::get('/notifications', [NotificationController::class, 'volunteerIndex'])->name('volunteer.notifications');

    Route::post('/contact-requests/{requestId}/respond', [VolunteerController::class, 'respondContactRequest'])
        ->name('volunteer.contact.respond');
    Route::get('/contact-requests', [VolunteerController::class, 'getContactRequests'])
        ->name('volunteer.contact.requests');
    Route::get('/shared-contacts', [VolunteerController::class, 'getSharedContacts'])
        ->name('volunteer.shared.contacts');

    Route::get('/sponsorships', [VolunteerController::class, 'sponsorships'])->name('volunteer.sponsorships');

    Route::post('/appreciation/send', [VolunteerController::class, 'sendAppreciation'])
        ->name('volunteer.appreciation.send');

    Route::post('/sponsorship-applications/{application}/submit', [VolunteerController::class, 'submitSponsorshipApplication'])
        ->name('volunteer.sponsorship-applications.submit');

    Route::post('/sponsorship-applications/update', [VolunteerController::class, 'updateSponsorshipApplication'])->name('volunteer.sponsorship-applications.update');
});

// Organization Routes
Route::prefix('organization')->middleware(['check.role:Organization', 'auth'])->group(function () {
    // All specific routes first
    Route::get('/dashboard', [OrganizationController::class, 'index'])->name('organization.dashboard');
    Route::get('/profile', [OrganizationController::class, 'profile'])->name('organization.profile');
    Route::post('/profile', [OrganizationController::class, 'updateProfile'])->name('organization.profile.update');
    Route::get('/messages', [OrganizationController::class, 'messages'])->name('organization.messages');
    Route::patch('/messages/mark-all-read/{senderId}', [OrganizationController::class, 'markAllRead'])->name('organization.messages.mark-all-read');
    Route::post('/messages', [OrganizationController::class, 'storeMessage'])->name('organization.messages.store');
    Route::get('/projects', [OrganizationController::class, 'projects'])->name('organization.projects');
    Route::get('/projects/create', [OrganizationController::class, 'createProject'])->name('organization.projects.create');
    Route::post('/projects/{slug?}', [OrganizationController::class, 'storeProject'])->name('organization.projects.store');
    Route::post('/projects/{project}/request-review', [OrganizationController::class, 'requestReview'])->name('projects.requestReview');
    Route::get('/projects/{slug}/edit', [OrganizationController::class, 'editProject'])->name('organization.projects.edit');
    Route::put('/projects/{slug}', [OrganizationController::class, 'updateProject'])->name('organization.projects.update');
    Route::get('/bookings', [OrganizationController::class, 'volunteerBookings'])->name('organization.bookings');
    Route::put('/bookings/{booking}/update-status', [OrganizationController::class, 'updateBookingStatus'])->name('bookings.update-status');
    Route::get('/points', [OrganizationController::class, 'points'])->name('organization.points');

    // API routes
    Route::get('/shared-contacts', [OrganizationController::class, 'getSharedContacts'])->name('organization.shared.contacts');
    Route::get('/contact-requests', [OrganizationController::class, 'getContactRequests'])->name('organization.contact.requests');
    Route::post('/contact-request', [OrganizationController::class, 'requestContactAccess'])->name('organization.contact.request');

    // Featured projects
    Route::get('/projects/{project}/feature', [FeaturedProjectController::class, 'showFeatureModal'])->name('featured.showModal');
    Route::post('/featured/checkout', [FeaturedProjectController::class, 'checkout'])->name('featured.checkout');
    Route::get('/featured/success', [FeaturedProjectController::class, 'success'])->name('featured.success');
    Route::get('/featured/cancel', [FeaturedProjectController::class, 'cancel'])->name('featured.cancel');

    // PayPal routes for featured projects
    Route::post('/paypal/featured/create-order', [FeaturedProjectController::class, 'createPayPalOrder'])
        ->name('paypal.featured.create-order');

    Route::post('/paypal/featured/capture-order', [FeaturedProjectController::class, 'capturePayPalOrder'])
        ->name('paypal.featured.capture-order');

    Route::get('/paypal/featured/success', [FeaturedProjectController::class, 'paypalSuccess'])
        ->name('paypal.featured.success');

    Route::get('/paypal/featured/cancel', [FeaturedProjectController::class, 'paypalCancel'])
        ->name('paypal.featured.cancel');

    // Verification
    Route::get('/{organization_profile}/verification', [OrganizationController::class, 'verification'])->name('organization.verification');
    Route::post('/{organization_profile}/verification', [OrganizationController::class, 'storeVerification'])->name('organization.verification.store');

    // Wildcard route LAST
    Route::get('/{volunteer_profile}', [OrganizationController::class, 'volunteerProfile'])->name('organization.volunteer.profile');
});

// Chat Routes
Route::middleware(['auth'])->prefix('chats')->group(function () {
    Route::get('/list', [ChatController::class, 'listChats'])->name('volunteer.chat.list');
    Route::post('/new', [ChatController::class, 'startNewChat'])->name('volunteer.chat.new');
    Route::post('/store', [ChatController::class, 'store'])->name('volunteer.chat.store');
    Route::get('/{chat}/messages', [ChatController::class, 'getMessages'])->name('volunteer.chat.messages');
    Route::post('/{chat}/read', [ChatController::class, 'markAsRead'])->name('volunteer.chat.read');
});

// Payment Routes
Route::middleware('volunteer')->middleware(['check.role:Volunteer', 'auth'])->group(function () {
    Route::post('/organizations/{organization}/follow', [VolunteerFollowOrganization::class, 'follow'])
        ->name('organizations.follow');
    Route::delete('/organizations/{organization}/unfollow', [VolunteerFollowOrganization::class, 'unfollow'])
        ->name('organizations.unfollow');

    Route::post('/payment/checkout', [StripePaymentController::class, 'checkout'])->name('payment.checkout');
    Route::get('/payment/success', [StripePaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel', [StripePaymentController::class, 'cancel'])->name('payment.cancel');

    // Add PayPal routes
    Route::post('/paypal/create-order', [PayPalPaymentController::class, 'createOrder'])->name('paypal.create-order');
    Route::post('/paypal/capture-order', [PayPalPaymentController::class, 'captureOrder'])->name('paypal.capture-order');
    Route::get('/paypal/success', [PayPalPaymentController::class, 'success'])->name('paypal.success');
    Route::get('/paypal/cancel', [PayPalPaymentController::class, 'cancel'])->name('paypal.cancel');
    Route::post('/paypal/webhook', [PayPalPaymentController::class, 'handleWebhook'])->name('paypal.webhook');
});

// Notification Routes
Route::middleware(['auth'])->group(function () {
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::get('/api/notifications/unread-count', [NotificationController::class, 'getUnreadCount']);
    Route::get('/api/notifications/recent', [NotificationController::class, 'getRecentNotifications']);
});

// Mail preview routes (development)
Route::get('/mail-preview/user', function () {
    $booking = VolunteerBooking::with(['user', 'project.user'])->first();
    $payment = Payment::first();
    return new PaymentSuccessfulUser($booking, $payment);
});

Route::get('/mail-preview/owner', function () {
    $booking = VolunteerBooking::with(['user', 'project.user'])->first();
    $payment = Payment::first();
    return new PaymentSuccessfulOwner($booking, $payment);
});

// Webhook routes
Route::post('/stripe/webhook', [FeaturedProjectController::class, 'handleWebhook']);

// DYNAMIC ROUTES - MUST BE LAST
Route::get('/organizations/{organization_slug}', [HomeController::class, 'OrganizationProfile'])
    ->name('public.organization.profile');

require __DIR__ . '/auth.php';

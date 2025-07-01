<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ChatController;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminsController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Auth\OtpVerificationController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/contact', [HomeController::class, 'contact'])->name('contact');
Route::get('/privacy-policy', [HomeController::class, 'privacyPolicy'])->name('privacy.policy');
Route::get('/terms-and-conditions', [HomeController::class, 'termsAndConditions'])->name('terms.conditions');
Route::get('/faq', [HomeController::class, 'faq'])->name('faq');
Route::get('/volunteer', [HomeController::class, 'volunteer'])->name('volunteer');
Route::get('/organization', [HomeController::class, 'organization'])->name('organization');
Route::get('/volunteer-programs', [HomeController::class, 'projects'])->name('projects');
Route::get('/volunteer-programs/{slug}', [HomeController::class, 'viewProject'])->name('projects.home.view');

Route::get('/volunteer-programs/{slug}/volunteer', [BookingController::class, 'index'])->name('project.volunteer.booking');

Route::post('/volunteer-programs/report', [VolunteerController::class, 'storeProjectReport'])->name('project.report.store');


Route::post('/send-verification-code', [BookingController::class, 'volunteerEmailSend'])->name('volunteer.email.send');
Route::post('/check-email-exists', [BookingController::class, 'checkEmailExists'])->name('volunteer.email.exists');
Route::post('/volunteer/email/verify', [BookingController::class, 'verify'])->name('volunteer.email.verify');
Route::post('/volunteer-booking/store', [BookingController::class, 'store'])->name('volunteer.booking.store');

Route::post('/auth/volunteer-booking/store', [BookingController::class, 'authStore'])->name('auth.volunteer.booking.store');

Route::get('/dashboard', function () {
    $user = Auth::user();

    if ($user->role === "Organization") {
        return redirect()->route('organization.dashboard');
    }

    if ($user->role === "Volunteer") {
        return redirect()->route('volunteer.dashboard');
    }
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('google.login');
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

Route::get('/verify-otp', [OtpVerificationController::class, 'show'])->name('otp.verify');
Route::post('/verify-otp', [OtpVerificationController::class, 'store'])->name('otp.verify.store');

Route::post('/otp/resend', [AuthenticatedSessionController::class, 'resend'])->name('otp.resend');

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
    });
});


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
});

Route::prefix('organization')->middleware(['check.role:Organization', 'auth'])->group(function () {
    Route::get('/dashboard', [OrganizationController::class, 'index'])->name('organization.dashboard');
    Route::get('/profile', [OrganizationController::class, 'profile'])->name('organization.profile');
    Route::post('/profile', [OrganizationController::class, 'updateProfile'])->name('organization.profile.update');
    Route::get('/messages', [OrganizationController::class, 'messages'])
        ->name('organization.messages');
    Route::patch('/messages/mark-all-read/{senderId}', [OrganizationController::class, 'markAllRead'])
        ->name('organization.messages.mark-all-read');
    Route::post('/messages', [OrganizationController::class, 'storeMessage'])
        ->name('organization.messages.store');
    Route::get('/projects', [OrganizationController::class, 'projects'])->name('organization.projects');
    Route::get('/projects/create', [OrganizationController::class, 'createProject'])->name('organization.projects.create');
    Route::post('/projects', [OrganizationController::class, 'storeProject'])->name('organization.projects.store');
    Route::post('/projects/{project}/request-review', [OrganizationController::class, 'requestReview'])->name('projects.requestReview');
    Route::get('/projects/{slug}/edit', [OrganizationController::class, 'editProject'])->name('organization.projects.edit');
    Route::post('/projects/{slug}', [OrganizationController::class, 'updateProject'])->name('organization.projects.update');
    Route::get('/bookings', [OrganizationController::class, 'volunteerBookings'])->name('organization.bookings');
    Route::post('/bookings/{booking}/update-status', [OrganizationController::class, 'updateBookingStatus'])
        ->name('bookings.update-status');
});

// routes/web.php
Route::middleware('volunteer')->middleware(['check.role:Volunteer', 'auth'])->group(function () {
    Route::prefix('chat')->group(function () {
        Route::get('/', [ChatController::class, 'index']);
        Route::post('/', [ChatController::class, 'store'])->name('volunteer.chat.store');
        Route::post('/{chat}/read', [ChatController::class, 'markAsRead']);
    });
});

require __DIR__ . '/auth.php';

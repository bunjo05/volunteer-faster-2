@extends('emails.layouts.payment')

@section('content')
<div class="receipt">
    <div class="receipt-header">
        <h2 class="receipt-title">Your Payment Confirmation</h2>
        <div class="receipt-meta">Transaction #{{ $payment->stripe_payment_id }}</div>
    </div>

    <div class="receipt-content">
        <div class="receipt-row">
            <span class="receipt-label">Project:</span>
            <span class="receipt-value">{{ $booking->project->title }}</span>
        </div>

        <div class="receipt-row">
            <span class="receipt-label">Organization:</span>
            <span class="receipt-value">{{ $booking->project->user->name }}</span>
        </div>

        <div class="receipt-row">
            <span class="receipt-label">Payment Date:</span>
            <span class="receipt-value">{{ $payment->created_at->format('M j, Y \a\t g:i A') }}</span>
        </div>

        {{-- <div class="receipt-row">
            <span class="receipt-label">Total Project Amount:</span>
            <span class="receipt-value">${{ number_format($payment->full_amount, 2) }}</span>
        </div> --}}

        <div class="receipt-row">
            <span class="receipt-label">Amount Paid:</span>
            <span class="receipt-value" style="font-weight: 700; color: #667eea;">${{ number_format($payment->amount, 2) }}</span>
        </div>

        <div class="receipt-total">
            <div class="receipt-row">
                <span class="receipt-label">Payment Status:</span>
                <span class="receipt-value">
                    <span class="status-badge status-paid">{{ ucfirst(str_replace('_', ' ', $payment->status)) }}</span>
                </span>
            </div>
        </div>
    </div>
</div>

<div class="message-box">
    <p><strong>Thank you for your payment!</strong> Your booking for "<strong>{{ $booking->project->title }}</strong>" is now confirmed. Please note the remaining amount should be paid directly to {{ $booking->project->organizationProfile->name }}. {{ $booking->project->organizationProfile->name }} has been notified and you'll receive further instructions as the start date approaches.</p>
</div>

{{-- <div class="button-container">
    <a href="{{ url('/projects/' . $booking->project->id) }}" class="button">View Project Details</a>
    <a href="{{ url('/my-bookings/' . $booking->id) }}" class="button button-secondary">View Your Booking</a>
</div> --}}

{{-- <div style="text-align: center; color: #718096; font-size: 14px; max-width: 80%; margin: 0 auto; line-height: 1.6;">
    <p>Please Login to your account to further details</p>
</div> --}}
@endsection

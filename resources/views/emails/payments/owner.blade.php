@extends('emails.layouts.payment')

@section('content')
<div class="receipt">
    <div class="receipt-header">
        <h2 class="receipt-title">Payment Received for Your Project</h2>
        <div class="receipt-meta">Transaction #{{ $payment->stripe_payment_id }}</div>
    </div>

    <div class="receipt-content">
        <div class="receipt-row">
            <span class="receipt-label">Your Project:</span>
            <span class="receipt-value">{{ $booking->project->title }}</span>
        </div>

        <div class="receipt-row">
            <span class="receipt-label">Volunteer:</span>
            <span class="receipt-value">{{ $booking->user->name }}</span>
        </div>

        <div class="receipt-row">
            <span class="receipt-label">Payment Date:</span>
            <span class="receipt-value">{{ $payment->created_at->format('M j, Y \a\t g:i A') }}</span>
        </div>

        <div class="receipt-row">
            <span class="receipt-label">Amount Received:</span>
            <span class="receipt-value" style="font-weight: 700; color: #667eea;">${{ number_format($payment->amount, 2) }}</span>
        </div>

        <div class="receipt-row">
            <span class="receipt-label">Next Steps:</span>
            <span class="receipt-value">Prepare for volunteer arrival</span>
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

<div class="message-box owner">
    <p><strong>{{ $booking->project->organizationProfile->name }}:</strong> A deposit payment for your "<strong>{{ $booking->project->title }}</strong>" has been successfully processed. The volunteer has been notified and you should prepare for their participation.</p>
</div>

{{-- <div class="button-container">
    <a href="{{ url('/projects/' . $booking->project->id) }}" class="button">View Project Details</a>
    <a href="{{ url('/bookings/' . $booking->id) }}" class="button button-secondary">View Booking</a>
</div> --}}
@endsection

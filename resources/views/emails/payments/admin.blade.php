@extends('emails.layouts.payment')

@section('content')
<div class="receipt">
    <div class="receipt-header">
        <h2 class="receipt-title">New Payment Received</h2>
        <div class="receipt-meta">Transaction #{{ $payment->stripe_payment_id }}</div>
    </div>

    <div class="receipt-content">
        <div class="receipt-row">
            <span class="receipt-label">Project:</span>
            <span class="receipt-value">{{ $booking->project->title }}</span>
        </div>

        <div class="receipt-row">
            <span class="receipt-label">Organization:</span>
            <span class="receipt-value">{{ $booking->project->organizationProfile->name }}</span>
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

<div class="message-box admin">
    <p><strong>Admin Notification:</strong> A Deposit payment has been successfully processed and recorded in the system.</p>
</div>

{{-- <div class="button-container">
    <a href="{{ url('/admin/payments/' . $payment->id) }}" class="button">View Payment Details</a>
    <a href="{{ url('/admin/bookings/' . $booking->id) }}" class="button button-secondary">View Booking</a>
</div> --}}
@endsection

@extends('emails.layouts.payment')

@section('content')
<div class="receipt">
    <div class="receipt-header">
        <h2 class="receipt-title">New Payment Received (Admin Notification)</h2>
        <div class="receipt-meta">Transaction #{{ $payment->stripe_payment_id }}</div>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Project:</span>
        <span class="receipt-value">{{ $booking->project->title }}</span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Organization:</span>
        <span class="receipt-value">{{ $booking->project->user->name }}</span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Volunteer:</span>
        <span class="receipt-value">{{ $booking->user->name }}</span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Payment Date:</span>
        <span class="receipt-value">{{ $payment->created_at->format('M j, Y g:i A') }}</span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Amount Received:</span>
        <span class="receipt-value">${{ number_format($payment->amount, 2) }}</span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Total Project Amount:</span>
        <span class="receipt-value">${{ number_format($payment->full_amount, 2) }}</span>
    </div>

    <div class="receipt-row receipt-total">
        <span class="receipt-label">Payment Status:</span>
        <span class="receipt-value" style="color: #38a169;">{{ ucfirst(str_replace('_', ' ', $payment->status)) }}</span>
    </div>
</div>

<div style="text-align: center; margin: 25px 0;">
    <a href="{{ url('/admin/bookings/' . $booking->id) }}" class="button">View Booking Details</a>
</div>

<p style="text-align: center;">
    This is an automated notification sent to all system administrators.
</p>
@endsection

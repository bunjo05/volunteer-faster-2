@extends('emails.layouts.payment')

@section('content')
<div class="receipt">
    <div class="receipt-header">
        <h2 class="receipt-title">Payment Receipt</h2>
        <div class="receipt-meta">Transaction #{{ $payment->stripe_payment_id }}</div>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Project:</span>
        <span class="receipt-value">{{ $booking->project->title }}</span>
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
        <span class="receipt-label">Deposit Received:</span>
        <span class="receipt-value">${{ number_format($payment->amount, 2) }}</span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Total Project Value:</span>
        <span class="receipt-value">${{ number_format($payment->full_amount, 2) }}</span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Balance Due:</span>
        <span class="receipt-value">${{ number_format($payment->full_amount - $payment->amount, 2) }}</span>
    </div>

    <div class="receipt-row receipt-total">
        <span class="receipt-label">Payment Status:</span>
        <span class="receipt-value" style="color: #38a169;">{{ ucfirst(str_replace('_', ' ', $payment->status)) }}</span>
    </div>
</div>

<div style="text-align: center; margin: 25px 0;">
    <a href="{{ url('/projects/' . $booking->project->slug) }}" class="button">View Project Details</a>
</div>

<p style="text-align: center;">
    Thank you for using {{ config('app.name') }}! Funds will be deposited to your account within 3-5 business days.
</p>
@endsection

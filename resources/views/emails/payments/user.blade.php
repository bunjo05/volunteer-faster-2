@extends('emails.layouts.payment')

@section('content')
<div class="receipt">
    <div class="receipt-header">
        <h2 class="receipt-title">Payment Confirmation</h2>
        <div class="receipt-meta">Receipt #{{ $payment->stripe_payment_id }}</div>
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
        <span class="receipt-label">Booking Dates:</span>
        <span class="receipt-value">
            {{ \Carbon\Carbon::parse($booking->start_date)->format('M j, Y') }} -
            {{ \Carbon\Carbon::parse($booking->end_date)->format('M j, Y') }}
        </span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Payment Date:</span>
        <span class="receipt-value">{{ $payment->created_at->format('M j, Y g:i A') }}</span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Deposit Paid:</span>
        <span class="receipt-value">${{ number_format($payment->amount, 2) }}</span>
    </div>

    <div class="receipt-row">
        <span class="receipt-label">Total Project Cost:</span>
        <span class="receipt-value">${{ number_format($payment->full_amount, 2) }}</span>
    </div>

    <div class="receipt-row receipt-total">
        <span class="receipt-label">Payment Status:</span>
        <span class="receipt-value" style="color: #38a169;">{{ ucfirst(str_replace('_', ' ', $payment->status)) }}</span>
    </div>
</div>

<div style="text-align: center; margin: 25px 0;">
    <a href="{{ url('/volunteer-programs/' . $booking->project->slug) }}" class="button">View Booking Details</a>
    <a href="{{ url('/user/bookings/' . $booking->id . '/invoice') }}" class="button" style="background-color: #4a5568; margin-left: 10px;">Download Invoice</a>
</div>

<p style="text-align: center;">
    Thank you for your payment! A confirmation has been sent to your email.<br>
    If you have any questions about your booking, please contact the project organizer.
</p>
@endsection

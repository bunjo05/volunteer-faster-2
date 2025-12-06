@extends('emails.layouts.payment')

@section('content')
<div class="email-container">
    <div class="header-banner" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Payment Confirmation</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Transaction Processed Successfully</p>
    </div>

    <div class="content-wrapper" style="padding: 40px 30px; background: #ffffff;">
        <!-- Transaction Overview -->
        <div class="card" style="background: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #667eea;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap;">
                <div>
                    <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px;">Transaction Summary</h3>
                    <div style="color: #718096; font-size: 14px; background: white; padding: 8px 12px; border-radius: 6px; display: inline-block;">
                        <strong>Reference:</strong> {{ $payment->stripe_payment_id }}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="amount-display" style="font-size: 32px; font-weight: 700; color: #38a169; margin: 0;">
                        ${{ number_format($payment->amount, 2) }}
                    </div>
                    <div class="status-badge" style="display: inline-block; background: #c6f6d5; color: #22543d; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-top: 10px; text-transform: capitalize;">
                        {{ str_replace('_', ' ', $payment->status) }}
                    </div>
                </div>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <div style="display: flex; align-items: center; color: #4a5568; font-size: 14px;">
                    <svg style="width: 16px; height: 16px; margin-right: 8px;" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                    Processed on {{ $payment->created_at->format('F j, Y \a\t g:i A') }}
                </div>
            </div>
        </div>

        <!-- Details Grid -->
        <div class="details-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="detail-card" style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                <div style="color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Project</div>
                <div style="color: #2d3748; font-size: 16px; font-weight: 600;">{{ $booking->project->title }}</div>
            </div>

            <div class="detail-card" style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                <div style="color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Organization</div>
                <div style="color: #2d3748; font-size: 16px; font-weight: 600;">{{ $booking->project->organizationProfile->name }}</div>
            </div>

            <div class="detail-card" style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                <div style="color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Volunteer</div>
                <div style="color: #2d3748; font-size: 16px; font-weight: 600;">{{ $booking->user->name }}</div>
            </div>
        </div>

        <!-- Admin Notification -->
        <div class="notification-box" style="background: #e6f7ff; border: 1px solid #91d5ff; border-radius: 8px; padding: 20px; margin-top: 30px;">
            <div style="display: flex; align-items: flex-start;">
                <div style="background: #1890ff; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                    <svg style="width: 18px; height: 18px;" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <div>
                    <h4 style="margin: 0 0 8px 0; color: #1890ff; font-size: 16px;">System Notification</h4>
                    <p style="margin: 0; color: #2d3748; line-height: 1.6; font-size: 14px;">
                        A deposit payment has been successfully processed and recorded in the system.
                        This transaction has been automatically logged for accounting purposes.
                    </p>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons" style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">Manage this transaction:</p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="{{ url('/admin/payments/' . $payment->id) }}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block; transition: all 0.3s;">
                    View Payment Details
                </a>
                <a href="{{ url('/admin/bookings/' . $booking->id) }}" style="background: white; color: #667eea; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block; border: 2px solid #667eea; transition: all 0.3s;">
                    View Booking
                </a>
                <a href="{{ url('/admin/transactions') }}" style="background: #f7fafc; color: #4a5568; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block; border: 2px solid #e2e8f0; transition: all 0.3s;">
                    All Transactions
                </a>
            </div>
        </div>

        <!-- Footer Note -->
        <div class="footer-note" style="margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #718096; font-size: 13px; line-height: 1.5;">
                This is an automated notification. Please do not reply to this email.<br>
                For assistance, contact your system administrator or refer to the help documentation.
            </p>
        </div>
    </div>
</div>

<style>
    @media only screen and (max-width: 600px) {
        .details-grid {
            grid-template-columns: 1fr !important;
        }
        .action-buttons div {
            flex-direction: column;
            align-items: center;
        }
        .action-buttons a {
            width: 100%;
            text-align: center;
            margin-bottom: 10px;
        }
    }
</style>
@endsection

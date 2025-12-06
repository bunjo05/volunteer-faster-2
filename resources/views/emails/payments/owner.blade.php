@extends('emails.layouts.payment')

@section('content')
<div class="email-container">
    <div class="header-banner" style="background: linear-gradient(135deg, #38b2ac 0%, #319795 100%); padding: 30px 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Payment Confirmed</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Funds Successfully Received</p>
    </div>

    <div class="content-wrapper" style="padding: 40px 30px; background: #ffffff;">
        <!-- Congratulations Card -->
        <div class="congratulations-card" style="background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #38b2ac;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="background: #38b2ac; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                    <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <div>
                    <h3 style="margin: 0; color: #234e52; font-size: 20px;">Payment Received!</h3>
                    <p style="margin: 5px 0 0; color: #4a5568; font-size: 14px;">Transaction #{{ $payment->stripe_payment_id }}</p>
                </div>
            </div>
        </div>

        <!-- Amount Highlight -->
        <div class="amount-section" style="text-align: center; margin-bottom: 40px; padding: 30px; background: #f8fafc; border-radius: 12px; border: 2px dashed #e2e8f0;">
            <div style="color: #718096; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Amount Received</div>
            <div style="font-size: 48px; font-weight: 800; color: #38a169; line-height: 1; margin: 15px 0;">
                ${{ number_format($payment->amount, 2) }}
            </div>
            <div class="status-badge" style="display: inline-block; background: #c6f6d5; color: #22543d; padding: 8px 24px; border-radius: 20px; font-size: 14px; font-weight: 600; text-transform: capitalize; margin-top: 10px;">
                {{ str_replace('_', ' ', $payment->status) }}
            </div>
        </div>

        <!-- Project & Transaction Details -->
        <div class="details-container" style="margin-bottom: 30px;">
            <h3 style="color: #2d3748; font-size: 18px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;">Transaction Details</h3>

            <div class="details-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                <div class="detail-card" style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Project</div>
                    <div style="color: #2d3748; font-size: 18px; font-weight: 700; margin-bottom: 5px;">{{ $booking->project->title }}</div>
                    <div style="color: #4a5568; font-size: 14px;">Organization: {{ $booking->project->organizationProfile->name }}</div>
                </div>

                <div class="detail-card" style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <div style="color: #718096; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Volunteer</div>
                    <div style="color: #2d3748; font-size: 18px; font-weight: 700; margin-bottom: 5px;">{{ $booking->user->name }}</div>
                    <div style="color: #4a5568; font-size: 14px;">Ready to participate in your project</div>
                </div>
            </div>
        </div>

        <!-- Timeline Section -->
        <div class="timeline-section" style="margin-bottom: 40px;">
            <h3 style="color: #2d3748; font-size: 18px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;">What's Next</h3>

            <div style="position: relative; padding-left: 30px;">
                <!-- Timeline connector -->
                <div style="position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: #e2e8f0;"></div>

                <!-- Step 1 -->
                <div style="position: relative; margin-bottom: 25px;">
                    <div style="position: absolute; left: -30px; top: 0; background: #38b2ac; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #38b2ac;"></div>
                    <div style="color: #2d3748; font-weight: 600; margin-bottom: 5px;">Payment Confirmed</div>
                    <div style="color: #718096; font-size: 14px; margin-bottom: 5px;">{{ $payment->created_at->format('F j, Y \a\t g:i A') }}</div>
                    <div style="color: #4a5568; font-size: 14px;">Deposit securely processed and verified</div>
                </div>

                <!-- Step 2 -->
                <div style="position: relative; margin-bottom: 25px;">
                    <div style="position: absolute; left: -30px; top: 0; background: #ecc94b; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #ecc94b;"></div>
                    <div style="color: #2d3748; font-weight: 600; margin-bottom: 5px;">Prepare for Volunteer</div>
                    <div style="color: #4a5568; font-size: 14px;">
                        The volunteer has been notified and is ready to participate in "<strong>{{ $booking->project->title }}</strong>"
                    </div>
                </div>

                <!-- Step 3 -->
                <div style="position: relative;">
                    <div style="position: absolute; left: -30px; top: 0; background: #a0aec0; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #a0aec0;"></div>
                    <div style="color: #2d3748; font-weight: 600; margin-bottom: 5px;">Coordinate Details</div>
                    <div style="color: #4a5568; font-size: 14px;">
                        Review project details and prepare any necessary materials or instructions
                    </div>
                </div>
            </div>
        </div>

        <!-- Organization Message -->
        <div class="organization-message" style="background: #ebf8ff; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #bee3f8;">
            <div style="display: flex; align-items: flex-start;">
                <div style="background: #3182ce; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                    <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <div>
                    <h4 style="margin: 0 0 10px 0; color: #2c5282; font-size: 16px;">Message from {{ $booking->project->organizationProfile->name }}</h4>
                    <div style="color: #2d3748; line-height: 1.6; font-size: 15px; background: white; padding: 15px; border-radius: 6px;">
                        <p style="margin: 0;">Your deposit payment for <strong>"{{ $booking->project->title }}"</strong> has been successfully processed. The volunteer has been notified and is preparing to participate in your project.</p>
                        <p style="margin: 15px 0 0; color: #4a5568; font-size: 14px;">Now is the perfect time to review project details and prepare for their arrival.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons" style="margin-top: 40px; padding: 30px; background: #f8fafc; border-radius: 12px; text-align: center;">
            <h4 style="margin: 0 0 20px 0; color: #2d3748; font-size: 16px;">Manage Your Project</h4>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <a href="{{ url('/projects/' . $booking->project->id) }}" style="background: #38b2ac; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block; transition: all 0.3s; min-width: 180px;">
                    View Project Details
                </a>
                <a href="{{ url('/bookings/' . $booking->id) }}" style="background: white; color: #38b2ac; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block; border: 2px solid #38b2ac; transition: all 0.3s; min-width: 180px;">
                    View Booking
                </a>
                <a href="{{ url('/dashboard') }}" style="background: #f7fafc; color: #4a5568; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block; border: 2px solid #e2e8f0; transition: all 0.3s; min-width: 180px;">
                    Go to Dashboard
                </a>
            </div>
        </div>

        <!-- Help Section -->
        <div class="help-section" style="margin-top: 30px; padding: 20px; background: #fffaf0; border-radius: 8px; border: 1px solid #feebc8;">
            <div style="display: flex; align-items: center;">
                <div style="color: #dd6b20; margin-right: 12px;">
                    <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                    </svg>
                </div>
                <div>
                    <p style="margin: 0; color: #744210; font-size: 14px; line-height: 1.5;">
                        <strong>Need assistance?</strong> Contact our support team if you have any questions about this payment or need help with volunteer coordination.
                    </p>
                </div>
            </div>
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
            min-width: unset !important;
        }
        .amount-section div:first-child {
            font-size: 12px !important;
        }
        .amount-section div:nth-child(2) {
            font-size: 36px !important;
        }
    }

    a:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
</style>
@endsection

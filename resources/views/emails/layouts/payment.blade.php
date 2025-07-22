<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>{{ $title ?? 'Payment Notification' }}</title>
    <style>
        /* Modern Base Styles */
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #1a202c;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 620px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }

        /* Premium Header */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px 30px;
            text-align: center;
            color: white;
            position: relative;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        }

        .logo {
            max-height: 48px;
            margin-bottom: 16px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        /* Elegant Receipt Card */
        .receipt {
            background: white;
            border-radius: 10px;
            padding: 0;
            margin: 30px;
            box-shadow: 0 2px 16px rgba(0, 0, 0, 0.03);
            border: 1px solid #edf2f7;
        }

        .receipt-header {
            background: linear-gradient(to right, #f7fafc, #ffffff);
            border-bottom: 1px solid #e2e8f0;
            padding: 24px;
            text-align: center;
        }

        .receipt-title {
            font-size: 22px;
            font-weight: 700;
            color: #2d3748;
            margin: 0 0 6px 0;
            letter-spacing: -0.2px;
        }

        .receipt-meta {
            font-size: 14px;
            color: #718096;
            margin: 0;
            font-weight: 500;
        }

        /* Enhanced Receipt Rows */
        .receipt-content {
            padding: 24px;
        }

        .receipt-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f0f4f8;
            align-items: center;
        }

        .receipt-row:last-child {
            border-bottom: none;
        }

        .receipt-label {
            font-weight: 600;
            color: #4a5568;
            font-size: 15px;
        }

        .receipt-value {
            text-align: right;
            color: #1a202c;
            font-weight: 500;
            font-size: 15px;
            margin-left: 20px; /* Added margin for better spacing */
        }

        .receipt-total {
            background: #f8fafc;
            padding: 18px 24px;
            margin: 24px -24px -24px;
            border-radius: 0 0 10px 10px;
            border-top: 1px solid #e2e8f0;
            font-weight: 700;
            font-size: 16px;
        }

        /* Premium Status Badges */
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.4px;
            text-transform: uppercase;
        }

        .status-badge::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
        }

        .status-paid {
            background-color: #f0fff4;
            color: #38a169;
        }

        .status-paid::before {
            background-color: #38a169;
        }

        .status-pending {
            background-color: #fffaf0;
            color: #dd6b20;
        }

        .status-pending::before {
            background-color: #dd6b20;
        }

        /* Sophisticated Buttons */
        .button-container {
            text-align: center;
            margin: 32px 0;
        }

        .button {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2);
            border: none;
            font-size: 15px;
        }

        .button-secondary {
            background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
            color: #4a5568;
            box-shadow: 0 4px 6px rgba(160, 174, 192, 0.2);
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.3);
        }

        .button-secondary:hover {
            box-shadow: 0 6px 12px rgba(160, 174, 192, 0.3);
        }

        /* Refined Footer */
        .footer {
            background: #f8fafc;
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #718096;
            border-top: 1px solid #e2e8f0;
        }

        .footer p {
            margin: 8px 0;
            line-height: 1.5;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }

        /* Custom Message Box */
        .message-box {
            background: #f0f9ff;
            border-left: 4px solid #63b3ed;
            padding: 16px;
            margin: 20px 30px;
            border-radius: 0 8px 8px 0;
        }

        .message-box.admin {
            background: #f0fff4;
            border-left-color: #68d391;
        }

        .message-box.owner {
            background: #fffaf0;
            border-left-color: #f6ad55;
        }

        .message-box p {
            margin: 0;
            color: #2d3748;
            font-size: 14px;
            line-height: 1.5;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
            .container {
                margin: 0;
                border-radius: 0;
            }

            .receipt, .message-box {
                margin: 20px 16px;
            }

            .receipt-header {
                padding: 20px;
            }

            .button {
                width: 100%;
                padding: 16px;
                box-sizing: border-box;
                margin-bottom: 8px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            @if(config('app.logo'))
                <img src="{{ config('app.logo') }}" alt="{{ config('app.name') }}" class="logo">
            @else
                <h1>{{ config('app.name') }}</h1>
            @endif
        </div>

        @yield('content')

        <div class="footer">
            <p>© {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p>Need assistance? <a href="mailto:support@example.com">Contact our support team</a></p>
            <p style="color: #a0aec0; font-size: 12px;">Transaction ID: {{ $payment->stripe_payment_id }}</p>
        </div>
    </div>
</body>
</html>

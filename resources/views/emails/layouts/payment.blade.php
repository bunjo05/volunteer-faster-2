<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>{{ $title ?? 'Payment Notification' }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-height: 50px; }
        .receipt { border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 25px; }
        .receipt-header { border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 20px; }
        .receipt-title { font-size: 20px; font-weight: bold; color: #2d3748; margin: 0; }
        .receipt-meta { font-size: 14px; color: #718096; margin-top: 5px; }
        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .receipt-label { font-weight: 600; color: #4a5568; }
        .receipt-value { text-align: right; }
        .receipt-total { border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px; font-weight: bold; }
        .button { display: inline-block; padding: 10px 20px; background-color: #4299e1; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #718096; }
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
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <title>Thank You for Your Sponsorship</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .message { background: white; padding: 20px; border-left: 4px solid #4F46E5; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Your Support!</h1>
        </div>

        <div class="content">
            <p>Dear {{ $donorName }},</p>

            <p>{{ $volunteerName }} has sent you a special appreciation message for your generous sponsorship:</p>

            <div class="message">
                <p><em>"{{ $appreciationMessage }}"</em></p>
            </div>

            <p><strong>Project:</strong> {{ $projectName }}<br>
            <strong>Sponsored Amount:</strong> ${{ number_format($amount, 2) }}</p>

            <p>Your support is making a real difference in volunteer work and community development.</p>
        </div>

        <div class="footer">
            <p>Thank you for being part of our community!</p>
            <p>© {{ date('Y') }} Volunteer Platform. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

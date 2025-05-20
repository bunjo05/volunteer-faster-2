<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); padding: 30px;">
        <h1 style="color: #2d3748;">🔐 Your OTP Code</h1>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">Thank you for signing up! To complete your registration, please use the verification code below:</p>

        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; background-color: #edf2f7; padding: 10px 20px; border-radius: 6px; display: inline-block; letter-spacing: 4px;">
                 {{ $code }}
            </span>
        </div>

        <p style="font-size: 14px; color: #718096;">This code will expire in 10 minutes. If you did not initiate this request, please secure your account immediately.</p>

        <p style="font-size: 16px;">Thanks,<br><strong>{{ config('app.name') }}</strong> Team</p>
    </div>
</body>
</html>

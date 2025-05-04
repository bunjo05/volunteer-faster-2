<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status Update</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        .email-header img {
            width: 100px;
        }
        .email-body {
            margin-top: 20px;
        }
        .email-body p {
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
        }
        .status {
            font-weight: bold;
            color: #ff6600;
        }
        .cta {
            margin-top: 30px;
            text-align: center;
        }
        .cta a {
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 30px;
            font-size: 16px;
            border-radius: 5px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .email-footer {
            text-align: center;
            margin-top: 40px;
            font-size: 14px;
            color: #888888;
        }
        .email-footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="https://via.placeholder.com/100x50?text=Logo" alt="Company Logo">
            <h2 style="color: #333333;">Account Status Update</h2>
        </div>

        <div class="email-body">
            <p>Hello {{ $user->name }},</p>

            <p>Your account status has been updated to <span class="status" style="
                    color: {{
                        $status === 'Suspended' ? '#FF0000' :
                        ($status === 'Active' ? '#008000' : '#ff6600')
                    }};
                ">
                    {{ $status }}
                </span>.
           </p>

            <p>If you have any questions or need assistance, feel free to <a href="mailto:support@example.com">contact our support team</a>.</p>

            <div class="cta">
                <a href="{{ route('dashboard') }}">Go to Dashboard</a>
            </div>
        </div>

        <div class="email-footer">
            <p>Regards,</p>
            <p><strong>Admin Team</strong></p>
            <p><a href="https://example.com">Visit our website</a></p>
        </div>
    </div>
</body>
</html>

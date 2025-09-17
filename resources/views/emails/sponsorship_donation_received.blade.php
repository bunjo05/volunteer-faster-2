<!DOCTYPE html>
<html>
<body>
    <h2>Hi {{ $sponsorship->user->name }},</h2>

    <p>Good news! Someone has just made a donation to your sponsorship request.</p>

    <ul>
        <li><strong>Amount donated:</strong> ${{ number_format($amount, 2) }}</li>
        <li><strong>Booking / Project:</strong> {{ $sponsorship->booking->project->title ?? 'N/A' }}</li>
    </ul>

    <p>Keep up the great work on your volunteer journey!</p>

    <p>— The Team</p>
</body>
</html>

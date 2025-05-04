<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Project Review Request</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        .email-header h2 {
            color: #333333;
        }
        .email-body {
            margin-top: 20px;
        }
        .email-body p {
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
        }
        .project-title {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
        }
        .cta {
            margin-top: 30px;
            text-align: center;
        }
        .cta a {
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 25px;
            font-size: 16px;
            border-radius: 5px;
            display: inline-block;
        }
        .email-footer {
            text-align: center;
            margin-top: 40px;
            font-size: 14px;
            color: #888888;
        }
    </style>
</head>
<body>
<div class="email-container">
    <div class="email-header">
        <h2>🚀 New Project Review Request</h2>
    </div>

    <div class="email-body">
        <p>Hi Admin,</p>
        <p>A project has been submitted for your review:</p>
        <p class="project-title">"{{ $project->title }}"</p>
        <p><strong>Submitted By:</strong> {{ $project->user->name ?? 'N/A' }}<br>
           <strong>Submitted On:</strong> {{ $project->created_at->format('F j, Y') }}<br>
           <strong>Location:</strong> {{ $project->address ?? 'N/A' }}
        </p>

        <div class="cta">
            <a href="{{ url("/admin/projects/{$project->id}") }}">🔍 Review Project Now</a>
        </div>
    </div>

    <div class="email-footer">
        <p>Thanks for your continued support,<br><strong>{{ config('app.name') }} Team</strong></p>
    </div>
</div>
</body>
</html>

@component('mail::message')
# Regarding Your Featured Project Request

Hello {{ $featuredProject->user->name }},

We regret to inform you that your request to feature the project **{{ $featuredProject->project->title }}** has not been approved at this time.

**Reason for Rejection:**
{{ $featuredProject->rejection_reason }}

If you'd like to discuss this further or submit a revised request, please don't hesitate to contact our support team.

@component('mail::button', ['url' => route('organization.projects')])
View Your Projects
@endcomponent

We appreciate your understanding and continued participation in our platform.

Best regards,
The {{ config('app.name') }} Team
@endcomponent

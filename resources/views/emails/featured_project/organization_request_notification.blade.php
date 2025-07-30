@component('mail::message')
# Feature Request Received

Hello {{ $project->user->name }},

Your request to feature the project **{{ $project->title }}** has been received and is currently under review by our team.

We'll notify you once your request has been processed. This typically takes 1-2 business days.

@component('mail::button', ['url' => route('organization.projects')])
View Your Projects
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent

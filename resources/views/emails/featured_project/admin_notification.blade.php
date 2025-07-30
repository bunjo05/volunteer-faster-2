@component('mail::message')
# New Project Feature Request

A new project feature request has been submitted and requires your approval.

**Project:** {{ $project->title }}
**Submitted By:** {{ $project->user->name }} ({{ $project->user->email }})

@component('mail::button', ['url' => route('admin.featured.projects')])
Review Feature Requests
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent

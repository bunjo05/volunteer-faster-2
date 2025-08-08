@component('mail::message')
# Organization Verification: {{ $status }}

@if($status === 'Approved')
@component('mail::panel')
🎉 Congratulations!
Your organization **{{ $organization->name }}** has been successfully **verified** and is now visible to the public.
@endcomponent
@else
@component('mail::panel')
❌ Unfortunately, your organization **{{ $organization->name }}** verification has been **rejected**.
@endcomponent
@endif

@if($verification->comments)
> **Admin Comments**
> {{ $verification->comments }}
@endif

@component('mail::button', ['url' => route('organization.profile', ['organization_profile' => $organization->slug]), 'color' => $status === 'Approved' ? 'success' : 'error'])
View Organization Profile
@endcomponent

Thanks,
**{{ config('app.name') }}** Team
@endcomponent

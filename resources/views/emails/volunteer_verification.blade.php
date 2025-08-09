@component('mail::message')
# Volunteer Verification: {{ $status }}

@if($status === 'Approved')
@component('mail::panel')
🎉 Congratulations!
Your account **{{ $volunteer->user->name }}** has been successfully **verified** and is now visible to the public.
@endcomponent
@else
@component('mail::panel')
❌ Unfortunately, your account **{{ $volunteer->user->name }}** verification has been **rejected**.
@endcomponent
@endif

@if($verification->comments)
> **Admin Comments**
> {{ $verification->comments }}
@endif

@component('mail::button', ['url' => route('volunteer.profile', ['volunteer_profile' => $volunteer->slug]), 'color' => $status === 'Approved' ? 'success' : 'error'])
View volunteer Profile
@endcomponent

Thanks,
**{{ config('app.name') }}** Team
@endcomponent

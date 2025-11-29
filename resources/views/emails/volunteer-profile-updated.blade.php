@component('mail::message')
# Volunteer Profile Updated

Hello Admin,

The volunteer **{{ $user->name }}** has updated their profile information.

**Volunteer Details:**
- **Name:** {{ $user->name }}
- **Email:** {{ $user->email }}
- **Profile Last Updated:** {{ $volunteer->updated_at->format('F j, Y \a\t g:i A') }}

@if(!empty($changes))
**Recent Changes:**
@foreach($changes as $field => $change)
- **{{ ucfirst(str_replace('_', ' ', $field)) }}:**
  {{ $change['old'] ?? 'Not set' }} → {{ $change['new'] ?? 'Not set' }}
@endforeach
@endif

**Current Profile Information:**
- **Gender:** {{ $volunteer->gender ?? 'Not specified' }}
- **Date of Birth:** {{ $volunteer->dob ? \Carbon\Carbon::parse($volunteer->dob)->format('F j, Y') : 'Not specified' }}
- **Location:** {{ $volunteer->city ? $volunteer->city . ', ' : '' }}{{ $volunteer->state ? $volunteer->state . ', ' : '' }}{{ $volunteer->country ?? 'Not specified' }}
- **Phone:** {{ $volunteer->phone ?? 'Not specified' }}
- **Education Status:** {{ $volunteer->education_status ?? 'Not specified' }}
- **Skills:** {{ $volunteer->skills ? implode(', ', $volunteer->skills) : 'Not specified' }}
- **Hobbies:** {{ $volunteer->hobbies ? implode(', ', $volunteer->hobbies) : 'Not specified' }}

@component('mail::button', ['url' => route('admin.volunteers')])
View Volunteer in Admin Panel
@endcomponent

You can review the updated profile and take any necessary actions through the admin dashboard.

Thanks,<br>
{{ config('app.name') }}
@endcomponent

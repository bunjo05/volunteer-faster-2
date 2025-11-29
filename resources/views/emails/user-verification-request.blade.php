@component('mail::message')
# New Verification Request Submitted

Hello Admin,

A new verification request has been submitted on the platform.

@if($userRole === 'Organization')
## Organization Details:
- **Organization Name:** {{ $organizationProfile->name }}
- **Contact Person:** {{ $user->name }}
- **Email:** {{ $user->email }}
- **Phone:** {{ $organizationProfile->phone ?? 'Not provided' }}
- **Location:** {{ $organizationProfile->city ? $organizationProfile->city . ', ' : '' }}{{ $organizationProfile->state ? $organizationProfile->state . ', ' : '' }}{{ $organizationProfile->country ?? 'Not specified' }}
- **Founded Year:** {{ $organizationProfile->foundedYear ?? 'Not specified' }}
- **Website:** {{ $organizationProfile->website ?? 'Not provided' }}

@if($organizationProfile->mission_statement)
**Mission Statement:**
{{ $organizationProfile->mission_statement }}
@endif

@if($organizationProfile->description)
**Organization Description:**
{{ Str::limit($organizationProfile->description, 200) }}
@endif

@elseif($userRole === 'Volunteer')
## Volunteer Details:
- **Name:** {{ $user->name }}
- **Email:** {{ $user->email }}
- **Phone:** {{ $volunteerProfile->phone ?? 'Not provided' }}
- **Location:** {{ $volunteerProfile->city ? $volunteerProfile->city . ', ' : '' }}{{ $volunteerProfile->state ? $volunteerProfile->state . ', ' : '' }}{{ $volunteerProfile->country ?? 'Not specified' }}
- **Date of Birth:** {{ $volunteerProfile->dob ? \Carbon\Carbon::parse($volunteerProfile->dob)->format('F j, Y') : 'Not provided' }}
- **Education Status:** {{ $volunteerProfile->education_status ?? 'Not specified' }}

@if($volunteerProfile->skills && count($volunteerProfile->skills) > 0)
**Skills:** {{ implode(', ', $volunteerProfile->skills) }}
@endif

@if($volunteerProfile->hobbies && count($volunteerProfile->hobbies) > 0)
**Hobbies:** {{ implode(', ', $volunteerProfile->hobbies) }}
@endif
@endif

## Verification Information:
- **Submitted On:** {{ now()->format('F j, Y \a\t g:i A') }}
- **User Role:** {{ $userRole }}
- **User Status:** {{ $user->status }}

@if($verificationData)
**Verification Details:**
@if(isset($verificationData['verification_type']))
- **Verification Type:** {{ $verificationData['verification_type'] }}
@endif
@if(isset($verificationData['type_of_document']))
- **Document Type:** {{ $verificationData['type_of_document'] }}
@endif
@if(isset($verificationData['type_of_document_2']))
- **Additional Document:** {{ $verificationData['type_of_document_2'] }}
@endif
@endif

## Quick Actions:

@if($userRole === 'Organization')
@component('mail::button', ['url' => route('admin.organizations.verifications', $organizationProfile->slug)])
Review Organization Verification
@endcomponent

@component('mail::button', ['url' => route('admin.organizations.view', $organizationProfile->slug)])
View Organization Profile
@endcomponent

@elseif($userRole === 'Volunteer')
@component('mail::button', ['url' => route('admin.volunteers.verifications', $volunteerProfile->id)])
Review Volunteer Verification
@endcomponent

@component('mail::button', ['url' => route('admin.volunteers')])
View All Volunteers
@endcomponent
@endif

Please review the verification request and take appropriate action through the admin dashboard.

Thanks,<br>
{{ config('app.name') }}

@endcomponent

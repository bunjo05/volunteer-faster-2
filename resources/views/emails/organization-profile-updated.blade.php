<x-mail::message>
@if($isNewProfile)
# New Organization Profile Created
@else
# Organization Profile Updated
@endif

**Organization:** {{ $organization->name }}
**User:** {{ $user->name }} ({{ $user->email }})
**Profile Slug:** {{ $organization->slug }}
**Updated At:** {{ now()->format('F j, Y \a\t g:i A') }}

## Profile Details
- **Country:** {{ $organization->country }}
- **City:** {{ $organization->city ?? 'Not specified' }}
- **State:** {{ $organization->state ?? 'Not specified' }}
- **Founded Year:** {{ $organization->foundedYear }}
- **Phone:** {{ $organization->phone }}
- **Website:** {{ $organization->website ?? 'Not specified' }}

@if(!$isNewProfile && $originalData)
## Changes Made
The following fields were updated:
@php
    $changedFields = [];
    foreach ($organization->getAttributes() as $key => $value) {
        if (isset($originalData[$key]) && $originalData[$key] != $value) {
            $changedFields[] = $key;
        }
    }
@endphp

@if(count($changedFields) > 0)
- {{ implode("\n- ", $changedFields) }}
@else
- No specific field changes detected (possible logo update or other file changes)
@endif
@endif

<x-mail::button :url="route('admin.organizations.view', $organization->slug)">
View Organization Profile
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>

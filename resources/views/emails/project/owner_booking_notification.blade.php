<x-mail::message>
# New Volunteer Booking for: {{ $project->title }}

Hello {{ $project->user->name }},

You have received a new volunteer booking for your project **{{ $project->title }}**.

**Volunteer Details:**
- Name: {{ $volunteer->name }}
{{-- - Email: {{ $volunteer->email }} --}}
{{-- @if($volunteer->volunteerProfile && $volunteer->volunteerProfile->phone)
- Phone: {{ $volunteer->volunteerProfile->phone }}
@endif --}}

**Booking Details:**
- Start Date: {{ \Carbon\Carbon::parse($booking->start_date)->format('F j, Y') }}
- End Date: {{ \Carbon\Carbon::parse($booking->end_date)->format('F j, Y') }}
- Number of Volunteers: {{ $booking->number_of_travellers }}
@if($booking->message)
- Message: {{ $booking->message }}
@endif

<x-mail::button :url="route('organization.projects', $project)">
Manage This Booking
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>

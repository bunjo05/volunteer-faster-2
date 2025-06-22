@component('mail::message')
# Volunteer Booking Reminder

Hello {{ $project->user->name }},

This is a reminder about the volunteer booking for your project **{{ $project->title }}**.

**Booking Details:**
- Volunteer: {{ $volunteer->name }}
- Dates:{{ \Carbon\Carbon::parse($booking->start_date)->format('F j, Y') }}
- Number of Volunteers: {{ $booking->number_of_travellers }}

@component('mail::button', ['url' => route('organization.bookings')])
View Booking Details
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent

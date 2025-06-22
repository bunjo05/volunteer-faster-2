<x-mail::message>
# Booking Confirmation

Hello {{ $booking->user->name }},

Thank you for your volunteer booking with **{{ $project->title }}**. Here are your booking details:

- **Project:** {{ $project->title }}
- **Start Date:** {{ \Carbon\Carbon::parse($booking->start_date)->format('F j, Y') }}
- **End Date:** {{ \Carbon\Carbon::parse($booking->end_date)->format('F j, Y') }}
- **Number of Volunteers:** {{ $booking->number_of_travellers }}

@if($project->organizationProfile)
If you have any questions, please contact the project organizer at {{ $project->organizationProfile->email }}.
@else
If you have any questions, please contact the project organizer using the contact information provided on the project page.
@endif

<x-mail::button :url="route('volunteer.projects')">
View Your Bookings
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>

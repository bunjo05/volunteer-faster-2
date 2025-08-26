@component('mail::message')
# Volunteer Booking Reminder

Hello **{{ $project->user->name }}**,

We hope you’re doing well!
This is a **{{ ucfirst($stage) }} Reminder** regarding the volunteer booking for your project:

---

### 📋 Project: **{{ $project->title }}**

**Volunteer Information:**
- 👤 Name: **{{ $volunteer->name }}**
- 📅 Start Date: **{{ \Carbon\Carbon::parse($booking->start_date)->format('F j, Y') }}**
- 👥 Number of Volunteers: **{{ $booking->number_of_travellers }}**

---

@component('mail::button', ['url' => route('organization.bookings')])
🔎 View Booking Details
@endcomponent

If you have already coordinated with your volunteer(s), you may kindly disregard this reminder. Otherwise, we encourage you to confirm the details as soon as possible.

Thank you for your time and commitment to making this project a success! 💙

Warm regards,
**{{ config('app.name') }} Team**
@endcomponent

@component('mail::message')
# 🎉 Congratulations! 🎉

Dear {{ $booking->user->name }},

We're thrilled to inform you that your volunteer program **{{ $booking->project->title }}** has been successfully completed! 🏆

**📅 Program Details:**
- **🗓️ Dates:** {{ \Carbon\Carbon::parse($booking->start_date)->format('M j, Y') }} to {{ \Carbon\Carbon::parse($booking->end_date)->format('M j, Y') }}
- **⏳ Duration:** {{ $booking->duration }} days
- **👥 Participants:** {{ $booking->number_of_travellers }}

Attached to this email, you'll find your **Volunteer Certificate** which includes a unique QR code for verification.

🌟 Thank you for your dedication and hard work. We hope you had a rewarding experience! 🌟

@component('mail::button', ['url' => route('volunteer.projects')])
📋 View Your Bookings
@endcomponent

Best regards,
The {{ config('app.name') }} Team

💙 We appreciate your contribution! 💙
@endcomponent

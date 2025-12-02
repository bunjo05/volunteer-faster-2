<x-mail::message>
# Sponsorship Application Status Update

Dear {{ $sponsorship->user->name }},

@if($oldStatus)
Your sponsorship application status has been changed from **{{ $oldStatus }}** to **{{ $newStatus }}**.
@else
Your sponsorship application status has been updated to **{{ $newStatus }}**.
@endif

## Application Details:
- **Project:** {{ $sponsorship->booking->project->title ?? 'N/A' }}
- **Total Amount Requested:** ${{ number_format($sponsorship->total_amount, 2) }}
- **Status:** <span style="color: {{ $newStatus === 'Approved' ? '#10b981' : ($newStatus === 'Rejected' ? '#ef4444' : '#f59e0b') }}">{{ $newStatus }}</span>
- **Updated On:** {{ now()->format('F d, Y') }}

@if($sponsorship->rejection_reason && $newStatus === 'Rejected')
### Reason for Rejection:
{{ $sponsorship->rejection_reason }}
@endif

## Next Steps:
@if($newStatus === 'Approved')
Congratulations! Your sponsorship application has been approved. Your request is now visible to potential sponsors on our platform. You can expect to receive funding offers from interested sponsors.

@elseif($newStatus === 'Rejected')
We appreciate your application. Unfortunately, we cannot approve it at this time. If you have any questions about the decision or would like to appeal, please contact our support team.

@else
Your application is currently under review. We will notify you once there are any updates.
@endif

<x-mail::button :url="route('volunteer.sponsorships')">
View My Sponsorships
</x-mail::button>

Thank you for using our platform,<br>
{{ config('app.name') }}
</x-mail::message>

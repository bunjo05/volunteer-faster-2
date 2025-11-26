<x-mail::message>
@if($recipientType === 'volunteer')
# 🎉 You Received a Sponsorship Donation!

Hello {{ $sponsorship->user->name }},

Great news! You've received a sponsorship donation for your volunteer journey.

**Donation Details:**
- **Amount:** ${{ number_format($donation->amount, 2) }}
- **Project:** {{ $sponsorship->booking->project->title }}
- **Date:** {{ $donation->created_at->format('F j, Y') }}

@if($donation->is_anonymous)
The donation was made anonymously.
@else
@if($donation->user)
The donation was made by {{ $donation->user->name }}.
@endif
@endif

Your total raised amount is now **${{ number_format($sponsorship->funded_amount, 2) }}** out of **${{ number_format($sponsorship->total_amount, 2) }}**.

Thank you for making a difference in your community!

@elseif($recipientType === 'donor')
# Thank You for Your Sponsorship!

Hello {{ $donation->user->name }},

Thank you for your generous sponsorship donation to support **{{ $sponsorship->user->name }}**'s volunteer journey.

**Donation Details:**
- **Amount:** ${{ number_format($donation->amount, 2) }}
- **Volunteer:** {{ $sponsorship->user->name }}
- **Project:** {{ $sponsorship->booking->project->title }}
- **Date:** {{ $donation->created_at->format('F j, Y') }}

Your support is helping make a real difference in communities around the world.

@if($donation->funding_allocation)
**Funding Allocation:**
@foreach(json_decode($donation->funding_allocation, true) as $category => $selected)
@if($selected)
- {{ ucfirst(str_replace('_', ' ', $category)) }}
@endif
@endforeach
@endif

Thank you for being part of this meaningful journey!

@else
# New Sponsorship Donation

A new sponsorship donation has been received.

**Donation Details:**
- **Amount:** ${{ number_format($donation->amount, 2) }}
- **Volunteer:** {{ $sponsorship->user->name }}
- **Project:** {{ $sponsorship->booking->project->title }}
- **Donor:** {{ $donation->is_anonymous ? 'Anonymous' : ($donation->user->name ?? 'Guest') }}
- **Date:** {{ $donation->created_at->format('F j, Y') }}

@endIf

<x-mail::button :url="route('volunteer.guest.sponsorship.page.with.volunteer', $sponsorship->public_id)">
View Sponsorship Page
</x-mail::button>

Thanks,
{{ config('app.name') }}
</x-mail::message>

<x-mail::message>
@if($newStatus === 'Active')
# Congratulations! Your Project Has Been Approved 🎉

Hello {{ $user->name }},

We're thrilled to inform you that your project "**{{ $project->title }}**" has been approved and is now active on our platform!

Your project is now visible to volunteers and supporters who can join your cause. This is a significant step toward making a positive impact in your community.

## What's Next?
- Your project is now searchable and visible to all platform users
- Volunteers can start applying to join your initiative
- You can track engagement and applications through your dashboard

<x-mail::button :url="route('projects', $project->slug)">
View Your Live Project
</x-mail::button>

Keep up the great work! We're excited to see the positive change your project will bring.

@elseif($newStatus === 'Rejected')
# Project Status Update: Requires Attention

Hello {{ $user->name }},

We're sorry to inform you that your project "**{{ $project->title }}**" has been reviewed and requires some modifications before it can be approved.

## Reason for Rejection:
@if($remark)
<x-mail::panel>
{{ $remark }}
</x-mail::panel>
@else
<x-mail::panel>
The project didn't meet our platform guidelines. Please review our requirements and make the necessary adjustments.
</x-mail::panel>
@endif

## Next Steps:
1. Review the feedback provided above
2. Make the necessary improvements to your project
3. Resubmit for review
4. Our team will re-evaluate your project promptly

<x-mail::button :url="route('projects', $project->slug)">
Edit Your Project
</x-mail::button>

We're here to help! If you have any questions about the feedback or need clarification, please don't hesitate to reach out to our support team.

@else
# Project Status Updated

Hello {{ $user->name }},

The status of your project "**{{ $project->title }}**" has been updated from **{{ $oldStatus }}** to **{{ $newStatus }}**.

@if($remark)
## Admin Remark:
<x-mail::panel>
{{ $remark }}
</x-mail::panel>
@endif

<x-mail::button :url="route('projects', $project->slug)">
View Project Details
</x-mail::button>

Thank you for your patience and understanding.
@endif

<br>
{{ config('app.name') }}
</x-mail::message>

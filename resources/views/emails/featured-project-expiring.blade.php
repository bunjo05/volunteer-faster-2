<x-mail::message>
# Your Featured Project Expires in {{ $daysLeft }} {{ Str::plural('day', $daysLeft) }}

Hello {{ $featuredProject->user->name }},

Your featured project "**{{ $project->title }}**" will expire on **{{ $featuredProject->end_date->format('F j, Y') }}** (in {{ $daysLeft }} {{ Str::plural('day', $daysLeft) }}).

<x-mail::button :url="route('organization.projects')">
Extend Featured Status
</x-mail::button>

Thank you for using our platform!<br>
{{ config('app.name') }}
</x-mail::message>

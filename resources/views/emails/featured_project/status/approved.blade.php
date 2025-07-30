@component('mail::message')
# 🎉 Congratulations!

Hello {{ $featuredProject->user->name }},

We're excited to inform you that your project **{{ $featuredProject->project->title }}** has been approved to be featured on our platform!

**Featured Plan:** {{ str_replace('_', ' ', $featuredProject->plan_type) }}
**Start Date:** {{ $featuredProject->start_date->format('M d, Y') }}
**End Date:** {{ $featuredProject->end_date->format('M d, Y') }}

Your project will now receive increased visibility and more opportunities to connect with volunteers.

@component('mail::button', ['url' => route('projects.home.view', $featuredProject->project->slug)])
View Your Featured Project
@endcomponent

Thanks for being part of our community!
The {{ config('app.name') }} Team
@endcomponent

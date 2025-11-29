@component('mail::message')
# Account Status Update

Hello {{ $user->name }},

@if($status === 'Active')
🎉 **Congratulations!** Your account has been **approved** and is now **active** on our platform.

@if($user->role === 'Organization')
You can now create projects and enjoy the full capabilities of the platform. Start making an impact by creating your first project and connecting with volunteers who share your mission.

@component('mail::button', ['url' => route('organization.projects.create')])
Create Your First Project
@endcomponent

**Want to enhance credibility?** You can continue to verify your organization by following the link below:

@component('mail::button', ['url' => route('organization.profile')])
Verify Your Organization
@endcomponent

@elseif($user->role === 'Volunteer')
You can now apply for volunteering opportunities at any project that matches your interests and skills. Start your journey by exploring available projects and making a difference in communities around the world.

@component('mail::button', ['url' => route('projects')])
Browse Available Projects
@endcomponent

@elseif($user->role === 'Sponsor')
You can now support volunteers and projects that align with your values. Help fund meaningful initiatives and make a lasting impact by sponsoring dedicated volunteers and their projects.

@component('mail::button', ['url' => route('guest.sponsorship.page')])
Explore Sponsorship Opportunities
@endcomponent

@endif

We're excited to have you on board and can't wait to see the positive impact you'll make!

@elseif($status === 'Suspended')
🚫 **Account Suspended**

We're sorry to inform you that your account has been **suspended**. This action was taken due to a violation of our platform policies or terms of service.

**What this means:**
- You cannot access most platform features
- Your projects/volunteering activities are temporarily paused
- You cannot receive or send messages

If you believe this is a mistake or would like to appeal this decision, please contact our support team immediately.

@component('mail::button', ['url' => 'mailto:support@example.com'])
Contact Support Team
@endcomponent

@elseif($status === 'Pending')
⏳ **Account Pending Approval**

Your account is currently **pending approval**. Our team is reviewing your registration details and will update your status shortly.

**What to expect:**
- We typically process approvals within 24-48 hours
- You'll receive an email notification once approved
- Some platform features may be limited until approval

Thank you for your patience during this process.

@endif

@if($status === 'Active')
## Next Steps:
1. Complete your profile to increase visibility
2. Explore the platform features
3. Connect with other members
4. Start creating or joining projects

@component('mail::button', ['url' => route('dashboard')])
Go to Dashboard
@endcomponent

@else
If you have any questions or need assistance, please don't hesitate to contact our support team.

@component('mail::button', ['url' => route('dashboard')])
Go to Dashboard
@endcomponent
@endif

Thanks,<br>
{{ config('app.name') }}

@component('mail::subcopy')
If you're having trouble clicking the buttons, copy and paste the URLs below into your web browser:

@if($status === 'Active' && $user->role === 'Organization')
- Create Project: {{ route('organization.projects.create') }}
- Verify Organization: {{ route('organization.profile') }}
@elseif($status === 'Active' && $user->role === 'Volunteer')
- Browse Projects: {{ route('projects') }}
@elseif($status === 'Active' && $user->role === 'Sponsor')
- Sponsorship Opportunities: {{ route('guest.sponsorship.page') }}
@endif
- Dashboard: {{ route('dashboard') }}
@endcomponent

@endcomponent

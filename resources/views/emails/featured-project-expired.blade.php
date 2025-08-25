<x-mail::message>
# 🌟 Featured Project Expired

Hi **{{ $featuredProject->user->name }}**,

We wanted to let you know that your featured project:

**“{{ $project->title }}”**
expired on **{{ $featuredProject->end_date->format('F j, Y') }}**.

---

## What this means
Your project is no longer highlighted in our featured section. Don’t worry—bringing it back to the spotlight is quick and easy.

<x-mail::button :url="route('organization.projects')">
✨ Feature This Project Again
</x-mail::button>

---

If you’d like to continue reaching more people and increasing visibility, we recommend featuring your project again.

Thanks for being a valued part of **{{ config('app.name') }}**. We’re excited to see your projects thrive!

Best regards,
The **{{ config('app.name') }}** Team
</x-mail::message>

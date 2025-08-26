@component('mail::message')
# New Platform Review Submitted

Hello Admin,

A new review has been submitted on the platform:

**Reviewer:** {{ $user->name }} ({{ $user->email }})
**Rating:** ⭐ {{ $review->rating }}/5

@if($review->message)
**Message:**
{{ $review->message }}
@else
_No message was provided._
@endif

@component('mail::button', ['url' => route('admin.platform.reviews')])
View All Reviews
@endcomponent

Thanks,
{{ config('app.name') }}
@endcomponent

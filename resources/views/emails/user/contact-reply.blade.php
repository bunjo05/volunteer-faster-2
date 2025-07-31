@component('mail::message')
# Response to Your Inquiry

**Subject:** {{ $contact->reply_subject }}
**Replied On:** {{ $contact->replied_at->format('F j, Y \a\t g:i a') }}

**Our Response:**
{{ $contact->reply_message }}

---

**Your Original Message ({{ $contact->created_at->format('F j, Y') }}):**
**Subject:** {{ $contact->subject }}
{{ $contact->message }}

@component('mail::button', ['url' => route('contact')])
Contact Us Again
@endcomponent

Thanks,
{{ config('app.name') }} Team
@endcomponent

@component('mail::message')
# New Contact Message Received

**From:** {{ $contact->name }} <{{ $contact->email }}>
**Subject:** {{ $contact->subject }}
**Date:** {{ $contact->created_at->format('F j, Y \a\t g:i a') }}

**Message:**
{{ $contact->message }}

@component('mail::button', ['url' => route('contact', $contact->id)])
View Message in Admin Panel
@endcomponent

Thanks,
{{ config('app.name') }}
@endcomponent

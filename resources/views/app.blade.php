<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

      <!-- Favicon - Add these lines -->
    <link rel="icon" type="logos" href="{{ asset('favicon.ico') }}">
    <link rel="icon" type="logos" sizes="16x16" href="{{ asset('logo.png') }}">
    <link rel="icon" type="logos" sizes="32x32" href="{{ asset('logo.png') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('logo.png') }}">
    <link rel="manifest" href="{{ asset('site.webmanifest') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Basic SEO -->
    <meta name="description" content="Join a global community of changemakers creating lasting impact through volunteer work.">

    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="Volunteer Faster | Find your Dream Project">
    <meta property="og:description" content="Volunteer Faster make Volunteering much more easy to do during your free time. Explore the best volunteer projects.">
    <meta property="og:image" content="{{ asset('hero.jpg') }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:site_name" content="Volunteer Faster">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Volunteer Faster | Projects Abroad 2026">
    <meta name="twitter:description" content="Volunteer Faster make Volunteering much more easy to do during your free time. Explore the best volunteer projects.">
    <meta name="twitter:image" content="{{ asset('hero.jpg') }}">
    <meta name="twitter:site" content="@volunteerfaster">

    <!-- Additional OG tags -->
    <meta property="og:locale" content="en_US">
    <meta property="article:author" content="Volunteer Faster">

    <script src="https://js.stripe.com/v3/"></script>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    @inertia
</body>
</html>

<!DOCTYPE html>
{{-- <html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class=""> --}}
    <html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="light">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <meta name="csrf-token" content="{{ csrf_token() }}">
        <script src="https://js.stripe.com/v3/"></script>
        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead


    <title>{pageSeo.title}</title>
    <meta name="title" content={pageSeo.title} />
    <meta name="description" content={pageSeo.description} />
    <meta name="keywords" content={pageSeo.keywords} />
    <meta name="author" content="Volunteer Platform" />
    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content={pageSeo.url} />
    <meta property="og:title" content={pageSeo.title} />
    <meta property="og:description" content={pageSeo.description} />
    <meta property="og:image" content={fullImageUrl} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={pageSeo.title} />
    <meta property="og:site_name" content="Volunteer Faster" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@volunteerfaster" />
    <meta name="twitter:creator" content="@volunteerfaster" />
    <meta name="twitter:title" content={pageSeo.title} />
    <meta name="twitter:description" content={pageSeo.description} />
    <meta name="twitter:image" content={fullImageUrl} />
    <meta name="twitter:image:alt" content={pageSeo.title} />


    <link rel="canonical" href={pageSeo.url} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Volunteer Faster",
            "url": pageSeo.url,
            "description": pageSeo.description,
            "publisher": {
                "@type": "Organization",
                "name": "Volunteer Faster",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${appUrl}/logo.png`,
                },
            },
        })}
    </script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

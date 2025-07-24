<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ config('app.name') }} - @yield('title', 'Page')</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f9fafb;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .navbar {
            background-color: white;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }
        .navbar-brand {
            font-weight: bold;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .navbar-brand img {
            height: 2rem;
            width: 2rem;
        }
        .nav-link {
            color: #4b5563;
            font-weight: 500;
            padding: 0.5rem 1rem;
        }
        .nav-link:hover {
            color: #2563eb;
        }
        .btn-primary {
            background-color: #2563eb;
            border-color: #2563eb;
            font-weight: 600;
            padding: 0.5rem 1rem;
        }
        .btn-primary:hover {
            background-color: #1d4ed8;
            border-color: #1d4ed8;
        }
        .mobile-menu {
            display: none;
        }
        .mobile-menu.show {
            display: block;
        }
        main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }
        .auth-card {
            width: 100%;
            /* max-width: 28rem; */
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
        }
        footer {
            background-color: white;
            box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.1);
            padding: 1rem;
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
        }
        @media (max-width: 767.98px) {
            .desktop-nav {
                display: none !important;
            }
            .mobile-menu-btn {
                display: block !important;
            }
        }
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
            <!-- Logo / Brand -->
            <a class="navbar-brand" href="{{ url('/') }}">
                <img src="{{ asset('images/logo.png') }}" alt="Logo" class="text-blue-600">
                <span>Volunteer Faster</span>
            </a>

            <!-- Desktop Navigation -->
            <div class="desktop-nav d-flex align-items-center">
                <div class="navbar-nav me-auto">
                    <a href="{{ route('home') }}" class="nav-link">Home</a>
                    <a href="{{ route('projects') }}" class="nav-link">Volunteer Programs</a>
                    {{-- <a href="{{ route('guide') }}" class="nav-link">Volunteer Guide</a> --}}
                </div>

                <!-- Auth Links -->
                <div class="d-flex align-items-center gap-3">
                    <a href="{{ route('login') }}" class="nav-link">Login</a>
                    <a href="{{ route('register') }}" class="btn btn-primary">Register</a>
                </div>
            </div>

            <!-- Mobile Menu Button -->
            <button class="navbar-toggler mobile-menu-btn d-lg-none" type="button"
                    onclick="document.getElementById('mobileMenu').classList.toggle('show')">
                <i class="fas fa-bars"></i>
            </button>
        </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <div id="mobileMenu" class="mobile-menu bg-white p-4 shadow-sm">
        <div class="container">
            <div class="d-flex flex-column gap-3">
                <a href="{{ route('home') }}" class="text-gray-700 hover:text-blue-600 font-medium">Home</a>
                <a href="{{ route('projects') }}" class="text-gray-700 hover:text-blue-600 font-medium">Volunteer Programs</a>
                {{-- <a href="{{ route('guide') }}" class="text-gray-700 hover:text-blue-600 font-medium">Volunteer Guide</a> --}}

                <div class="d-flex gap-3 mt-2">
                    <a href="{{ route('login') }}" class="btn btn-outline-primary flex-grow-1">Login</a>
                    <a href="{{ route('register') }}" class="btn btn-primary flex-grow-1">Register</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Page Content -->
    <main>
        <div class="auth-card">
            @yield('content')
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; {{ date('Y') }} Volunteer Faster. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito" rel="stylesheet">

    <!-- Scripts -->
    @vite(['resources/sass/app.scss', 'resources/js/app.js'])
</head>
<body>
    <div id="app">
    <nav class="navbar navbar-expand-md custom-navbar">
    <div class="container">
        <!-- Brand Logo -->
        <a class="navbar-brand" href="{{ url('/homepage') }}">
            LotMatch
        </a>

        <!-- Navbar Toggle Button for Mobile View -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto"> <!-- Centers the links horizontally -->
                <li class="nav-item">
                    <!-- <a class="nav-link" href="#">Explore</a> -->
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('properties') }}">Properties</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('about') }}">About</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('contact') }}">Contact</a>
                </li>
            </ul>

            <!-- Authentication Buttons (Login/Register) -->
            <div class="auth-buttons">
                @guest
                    <a class="btn btn-outline-light" href="{{ route('login') }}">Login</a>
                    <a class="btn btn-primary" href="{{ route('register') }}">Sign Up</a>
                @else
                    <a class="btn btn-outline-light" href="{{ route('logout') }}"
                        onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                        Logout
                    </a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                        @csrf
                    </form>
                @endguest
            </div>
        </div>
    </div>
</nav>
        <main class="py-4">
            @yield('content')
        </main>
    </div>

    
</body>
</html>

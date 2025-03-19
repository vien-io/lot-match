<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>3D Map - LotMatch</title>

    @vite(['resources/js/app.js', 'resources/css/homepage.css'])
</head>
<body class="threedbody">
    <!-- profile dropdown -->
    <div id="profile-container">
        <button id="profile-icon">👤</button>
        <div id="profile-dropdown">
            @auth
                <p>Logged in as: <strong>{{ Auth::user()->name }}</strong></p>
                <a href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">Logout</a>
                <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                    @csrf
                </form>
            @else
                <a href="{{ route('login') }}">Login</a>
                <a href="{{ route('register') }}">Register</a>
            @endauth
        </div>
    </div>
    <button id="toggle-panel">☰</button>
    <!-- <button id="camera-mode-btn">🔄 Camera Mode</button> -->
    <!-- Side Panel -->
    <div id="side-panel">
        <h4>Select a Block</h4>
        <ul id="block-list">
            
        </ul>
    </div>

    <!-- Three.js Container -->
    <div id="threejs-container"></div>

</body>
</html>

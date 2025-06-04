<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>3D Map - LotMatch</title>
    <script>
       /*  const isAdmin = @json(auth()->check() && auth()->user()->is_admin);
        console.log(isAdmin); */
    </script>
    @vite(['resources/js/app.js', 'resources/css/homepage.css'])
</head>

<body class="threedbody" 
    data-user-id="{{ auth()->id() }}"
    data-is-admin="{{ auth()->check() && auth()->user()->is_admin }}">
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
        <ul id="block-list"></ul>
    </div>

    <!-- threejs container -->
    <div id="threejs-container"></div>


<!--container with flexbox layout -->
<div id="lot-modal" class="modal">
    <div class="modal-content">
        <span class="close-btn lot-close">&times;</span>
        <h2>Lot Details</h2>
        
        <!-- flexbox to split 2 col -->
        <div class="modal-inner-content">
            <!-- left column: lot details/ratings -->
            <div class="left-column">
                <div id="lot-details"></div>
                <div class="reviews"></div>
                <div id="review-section"></div>
            </div>

            <!-- right column: 3d view -->
            <div class="right-column">
                <div id="house-3d-container">
                    <div id="model-container"></div>
                    <!-- 3d  -->
                </div>
            </div>
        </div>
    </div>
</div>

<!-- block details modal -->
<div id="block-modal" class="modal">
    <div class="modal-content">
        <div class="topTab">
            <h2>Block Details</h2>
            <span class="close-btn block-close">&times;</span>
        </div>
        <div class="modal-inner-content">   
            <!-- left: block details + 3d + forecasting -->
            <div class="left-outer-column">
                <div class="top-row">
                     <div class="mid-column">
                        <div id="block-3d-container">
                            <!-- canvas will be injected here -->
                        </div>
                    </div>
                    <div class="left-column">
                        <div id="block-details"></div>
                    </div>
                   
                </div>
                <div class="bottom-row">
                    <h3>Forecasting Data</h3>
                    <div id="block-summary"></div>
                    @if (auth()->check() && auth()->user()->is_admin)
                    <div id="forecasting-data">
                        <p><strong>Forecasted Rating:</strong> <span  id="forecast-value"></span></p>
                        <canvas id="forecastChart" width="400" height="200"></canvas>
                    </div>
                    @endif
                </div>
            </div>

            <!-- right: reviews -->
            <div class="right-column">
                <div id="block-review-section"></div>
                <div class="reviews"></div>
            </div>
        </div>
    </div>
</div>




    <div id="tooltip">
        <span id="tooltip-text"></span>
    </div>
    
</body>
</html>

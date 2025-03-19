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
<button id="toggle-panel">☰</button>
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

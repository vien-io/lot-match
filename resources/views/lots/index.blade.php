<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lots Available</title>
    <link rel="stylesheet" href="web.css">
</head>
<body>

<h1>Lots Available</h1>

<ul>
    @foreach($lots as $lot)
        <li>{{ $lot->name }} - ${{ $lot->price }}</li>
    @endforeach
</ul>

<div id="map-pos">
    <div id="map-container">
        <svg
            version="1.1"
            id="svg1"
            width="1200"
            height="826"
            viewBox="0 0 1200 826"
            xmlns="http://www.w3.org/2000/svg">
            
            <!-- Lot 1 -->
            <path
                class="lot"
                id="lot1"
                d="m 265.31162,512.1622 -65.93231,0.52746 -6.3295,-1.05492 -6.3295,-4.21967 -4.21967,-6.85696 -0.52746,-13.71392 -1.05492,-59.60281 4.21967,-25.31801 87.55811,8.43934 -1.05492,16.35121 -2.63729,17.40613 0.52746,23.20818 -4.21967,37.44955"
                fill="rgba(0, 255, 0, 0.5)"
                data-lot-id="1" />
            
            <!-- Lot 2 -->
            <path
                class="lot"
                id="lot2"
                d="m 292.21201,306.98084 59.60281,34.28481 58.02043,-32.17497 -15.2963,-32.70243 -12.659,-15.2963 -22.15326,-16.87867 -26.37292,-13.18646 -23.73563,-3.69221 h -6.85696 l -4.21967,28.48276 -6.3295,37.44955 z"
                fill="rgba(0, 255, 0, 0.5)"
                data-lot-id="2" />
        </svg>
    </div>
</div>

<script src="web.js"></script>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="web.css">
</head>
<body>
<h1>Lots Available</h1>

<ul>
    @foreach($lots as $lot)
        <li>{{ $lot->name }} - ${{ $lot->price }}</li>
    @endforeach
</ul>

<div id="map-container">
    <div class="lot" data-lot-id="1" style="top: 90px; left: 145px;">Lot 1</div>
    <div class="lot" data-lot-id="2" style="top: 185px; left: 190px;">Lot 2</div>
    <!-- Add more lots -->
</div>

<script src="web.js"></script>
</body>
</html>

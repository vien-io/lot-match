@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Block {{ $block->id }} – Rating Forecast</h2>
    <canvas id="forecastChart" data-block-id="{{ $block->id }}" height="100"></canvas>
</div>
@endsection

@vite(['resources/js/pages/blockForecastPage.js']) {{-- Make sure this is where you import your JS --}}

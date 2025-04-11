@extends('layouts.app')

@section('head')
    <link rel="stylesheet" href="{{ asset('css/analytics.css') }}">
@endsection

@section('content')
<h2 class="analytics-heading">Block Ratings Analytics</h2>

<!-- chart container -->
<div class="chart-container">
    <canvas id="ratingsChart"></canvas>
</div>

<!-- table for analytics -->
<div class="table-container">
    <table class="analytics-table">
        <thead>
            <tr>
                <th>Block</th>
                <th>Average Rating</th>
                <th>Total Reviews</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $row)
            <tr>
                <td>{{ $row->name }}</td>
                <td>{{ number_format($row->avg_rating, 2) }}</td>
                <td>{{ $row->total_reviews }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
<div id="ratings-data"
     data-labels='@json($data->pluck("name"))'
     data-ratings='@json($data->pluck("avg_rating"))'>
</div>

@endsection

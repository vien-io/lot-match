@extends('layouts.app')

@section('head')
    <link rel="stylesheet" href="{{ asset('css/analytics.css') }}">
@endsection

@section('content')
    <h2 class="analytics-heading">Block Ratings Analytics</h2>

    <!-- chat block ratings -->
    <div class="chart-container">
        <canvas id="ratingsChart" class="chart-canvas"></canvas>
    </div>

    <!-- rating distrib -->
    <div class="row">
        <div class="col-md-6">
            <h3>Rating Distribution</h3>
            <canvas id="ratingDistributionChart"  class="chart-canvas"></canvas>
        </div>

        <!-- top 5 highest -->
        <div class="col-md-6">
            <h3>Top 5 Highest Rated Lots</h3>
            <canvas id="topRatedLotsChart"></canvas>
        </div>
    </div>

    <!-- table container for analytics -->
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
                @foreach($blockRatings as $row)
                <tr>
                    <td>{{ $row->name }}</td>
                    <td>{{ number_format($row->avg_rating, 2) }}</td>
                    <td>{{ $row->total_reviews }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- recent views -->
    <div class="row mt-4">
        <div class="col-md-6">
            <h3>Recent Reviews</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Lot</th>
                        <th>User</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($recentReviews as $review)
                    <tr>
                        <td>{{ $review->lot_id }}</td>
                        <td>{{ $review->user_name }}</td>
                        <td>{{ $review->rating }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- lot availability -->
        <div class="col-md-6">
            <h3>Lot Availability</h3>
            <p>Available Lots: {{ $availableLots }}</p>
            <p>Reserved Lots: {{ $reservedLots }}</p>
        </div>
    </div>

    <div id="ratings-data"
        data-block-labels='@json($blockRatings->pluck("name"))'
        data-block-ratings='@json($blockRatings->pluck("avg_rating"))'
        data-rating-labels='@json($ratingDistribution->pluck("rating"))'
        data-rating-counts='@json($ratingDistribution->pluck("count"))'>
    </div>
    <div id="top-rated-data"
    data-labels='@json($topRatedLots->pluck("id"))'
    data-ratings='@json($topRatedLots->pluck("avg_rating"))'>
    </div>


@endsection
